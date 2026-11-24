// Company OS registry MCP, transport-free: the tools and the JSON-RPC handler.
// mcp/server.mjs serves it over stdio; server.mjs serves it over HTTP at /mcp.

export const VERSION = '0.4.0';
export const PROTOCOL = '2025-06-18';

/** @param {(rel: string) => Promise<string>} load reads a path under the registry root (llms/index.json, llms/*.md). */
export function createRegistry(load) {
    let cached = null;
    const index = async () => (cached ??= JSON.parse(await load('llms/index.json')));

    const words = (text) => String(text).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);

    function score(item, terms) {
        const name = words(`${item.name} ${item.title}`);
        const tags = (item.tags ?? []).flatMap(words);
        const body = words(`${item.tagline ?? ''} ${item.job ?? ''} ${item.summary ?? ''} ${item.description ?? ''}`);
        let total = 0;
        for (const term of terms) {
            const hit = (list, weight) => (list.includes(term) ? weight : list.some((word) => word.startsWith(term)) ? weight / 2 : 0);
            const found = hit(name, 6) + hit(tags, 3) + hit(body, 1);
            if (found === 0) return 0;
            total += found;
        }
        return total;
    }

    const kinds = {
        component: (data) => data.components.map((item) => ({ ...item, kind: 'component' })),
        block: (data) => data.compositions.filter((item) => item.kind === 'block'),
        template: (data) => data.compositions.filter((item) => item.kind === 'template'),
        piece: (data) => data.pieces.map((item) => ({ ...item, kind: 'piece' })),
    };

    const pool = (data, kind) => (kind ? kinds[kind](data) : Object.values(kinds).flatMap((pick) => pick(data)));
    const line = (item) => `- ${item.name} (${item.kind}) — ${item.title}: ${item.tagline ?? item.summary}`;
    const text = (value) => ({ content: [{ type: 'text', text: value }] });
    const install = (data, name) => data.install.replace('<name>', name);

    const kindProp = { type: 'string', enum: Object.keys(kinds), description: 'Limit to one kind.' };

    const tools = [
        {
            name: 'search_registry',
            description: 'Search Company OS components, blocks, templates and standard pieces by keywords (e.g. "audit log csv", "webhook retry", "reason dialog"). Returns the best matches with their registry names.',
            inputSchema: { type: 'object', properties: { query: { type: 'string' }, kind: kindProp, limit: { type: 'number', default: 10 } }, required: ['query'] },
            run: async ({ query, kind, limit = 10 }) => {
                const data = await index();
                const terms = words(query);
                const ranked = pool(data, kind)
                    .map((item) => ({ item, score: score(item, terms) }))
                    .filter((row) => row.score > 0)
                    .sort((a, b) => b.score - a.score)
                    .slice(0, Math.max(1, Math.min(50, limit)));
                return text(ranked.length ? ranked.map((row) => line(row.item)).join('\n') : `Nothing matches "${query}". Try fewer words, or list_registry.`);
            },
        },
        {
            name: 'list_registry',
            description: 'List every Company OS item, or every item of one kind.',
            inputSchema: { type: 'object', properties: { kind: kindProp } },
            run: async ({ kind }) => text(pool(await index(), kind).map(line).join('\n')),
        },
        {
            name: 'get_component',
            description: 'The full doc for one component: when to use it, props, examples, accessibility, don\'ts, and the shadcn install command.',
            inputSchema: { type: 'object', properties: { name: { type: 'string', description: 'Registry name, e.g. "data-table".' } }, required: ['name'] },
            run: async ({ name }) => {
                const data = await index();
                const item = data.components.find((entry) => entry.name === name || entry.title.toLowerCase() === String(name).toLowerCase());
                if (!item) throw new Error(`No component "${name}". Use search_registry.`);
                return text(`Install: ${install(data, item.name)}\n\n${await load(item.doc)}`);
            },
        },
        {
            name: 'get_composition',
            description: 'One block or template: what it shows, the pieces it implements, the components it needs, and the install command.',
            inputSchema: { type: 'object', properties: { name: { type: 'string', description: 'e.g. "template-audit-log-page" or "audit-log-page".' } }, required: ['name'] },
            run: async ({ name }) => {
                const data = await index();
                const item = data.compositions.find((comp) => comp.name === name || comp.name.replace(/^(block|template)-/, '') === name);
                if (!item) throw new Error(`No block or template "${name}". Use search_registry.`);
                const pieces = item.pieces.map((n) => data.pieces.find((piece) => piece.n === n)?.name).filter(Boolean);
                return text([`# ${item.title} (${item.kind})`, item.tagline, item.description, `Pieces: ${pieces.join(', ')}`, `Uses: ${item.deps.join(', ')}`, `Install: ${install(data, item.name)}`].join('\n\n'));
            },
        },
        {
            name: 'get_piece',
            description: 'One piece of the Company OS standard (the server recipe: rule, shape, code, tests, gotchas). Pass a slug like "webhooks", a number 1–27, or "standard" for the overview.',
            inputSchema: { type: 'object', properties: { piece: { type: 'string' } }, required: ['piece'] },
            run: async ({ piece }) => {
                if (piece === 'standard') return text(await load('llms/pieces/standard.md'));
                const data = await index();
                const item = data.pieces.find((entry) => entry.name === piece || String(entry.n) === String(piece));
                if (!item) throw new Error(`No piece "${piece}". Pieces: ${data.pieces.map((entry) => entry.name).join(', ')}.`);
                const components = item.components.length ? `\n\nComponents: ${item.components.join(', ')}` : '';
                return text(`${await load(item.doc)}${components}`);
            },
        },
    ];

    async function handle(message) {
        const { id, method, params = {} } = message;
        switch (method) {
            case 'initialize':
                return { protocolVersion: params.protocolVersion ?? PROTOCOL, capabilities: { tools: {} }, serverInfo: { name: 'company-os-registry', version: VERSION } };
            case 'ping':
                return {};
            case 'tools/list':
                return { tools: tools.map(({ run: _run, ...tool }) => tool) };
            case 'tools/call': {
                const tool = tools.find((candidate) => candidate.name === params.name);
                if (!tool) throw Object.assign(new Error(`Unknown tool ${params.name}`), { code: -32602 });
                try {
                    return await tool.run(params.arguments ?? {});
                } catch (error) {
                    return { ...text(error.message), isError: true };
                }
            }
            default:
                if (id === undefined) return undefined;
                throw Object.assign(new Error(`Method not found: ${method}`), { code: -32601 });
        }
    }

    /** One JSON-RPC message in, its response out (undefined for notifications). */
    async function respond(message) {
        if (!message || typeof message !== 'object' || Array.isArray(message)) return { jsonrpc: '2.0', id: null, error: { code: -32600, message: 'Invalid request' } };
        if (typeof message.method !== 'string') return undefined; // a client's reply; this server sends no requests
        try {
            const result = await handle(message);
            if (message.id !== undefined && result !== undefined) return { jsonrpc: '2.0', id: message.id, result };
        } catch (error) {
            if (message.id !== undefined) return { jsonrpc: '2.0', id: message.id, error: { code: error.code ?? -32603, message: error.message } };
        }
        return undefined;
    }

    return { respond, tools };
}
