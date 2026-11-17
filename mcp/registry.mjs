// Company OS registry MCP: the tools and the JSON-RPC handler, shared by every transport.
// Zero dependencies. Give it a loader (relative path -> text) and it answers MCP messages.
//
//   mcp/server.mjs   stdio, reads ./public or a remote COMPANY_OS_REGISTRY
//   server.mjs       POST /mcp (Streamable HTTP, stateless JSON), reads dist/

export const VERSION = '0.4.0';
export const PROTOCOLS = ['2025-11-25', '2025-06-18', '2025-03-26', '2024-11-05'];
export const PROTOCOL = PROTOCOLS[0];

const INSTRUCTIONS = [
    'Company OS: a standard (27 pieces) and a design system (components, blocks, templates) for company operating systems.',
    'Start with search_registry, then get_component / get_composition / get_piece for the full doc and the shadcn install command.',
    'get_piece "standard" is the overview.',
].join(' ');

const KINDS = ['component', 'block', 'template', 'piece'];
const MAX_LIMIT = 50;

const words = (value) => String(value ?? '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
const slug = (value) => words(value).join('-');

function score(item, terms, query) {
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
    // The whole query is the item's name or title ("data-table", "DataTable", "audit log page").
    const bare = item.name.replace(/^(block|template)-/, '');
    if ([item.name, bare, slug(item.title)].includes(query) || words(item.title).join('') === query.replace(/-/g, '')) total += 20;
    return total;
}

const picks = {
    component: (data) => data.components.map((item) => ({ ...item, kind: 'component' })),
    block: (data) => data.compositions.filter((item) => item.kind === 'block'),
    template: (data) => data.compositions.filter((item) => item.kind === 'template'),
    piece: (data) => data.pieces.map((item) => ({ ...item, kind: 'piece' })),
};

const line = (item) => `- ${item.name} (${item.kind}) — ${item.title}: ${item.tagline ?? item.summary ?? ''}`;
const text = (value) => ({ content: [{ type: 'text', text: value }] });
const fail = (message) => Object.assign(new Error(message), { user: true });
const rpcError = (code, message) => Object.assign(new Error(message), { code });

// Input validation: messages an assistant can act on, returned as tool errors (isError), not protocol errors.
function stringArg(args, key, { required = false } = {}) {
    const value = args[key];
    if (value === undefined || value === null || value === '') {
        if (required) throw fail(`"${key}" is required.`);
        return undefined;
    }
    if (typeof value === 'number' && Number.isFinite(value)) return String(value);
    if (typeof value !== 'string') throw fail(`"${key}" must be a string.`);
    return value.trim();
}

function kindArg(args) {
    const kind = stringArg(args, 'kind');
    if (kind === undefined || kind === 'all') return undefined;
    const normal = kind.toLowerCase().replace(/s$/, '');
    if (!KINDS.includes(normal)) throw fail(`Unknown kind "${kind}". Use one of: ${KINDS.join(', ')} (or leave it out for all).`);
    return normal;
}

function limitArg(args) {
    const value = args.limit;
    if (value === undefined || value === null) return 10;
    const number = typeof value === 'string' ? Number(value) : value;
    if (typeof number !== 'number' || !Number.isFinite(number)) throw fail('"limit" must be a number.');
    return Math.max(1, Math.min(MAX_LIMIT, Math.floor(number)));
}

const kindProp = { type: 'string', enum: KINDS, description: 'Limit to one kind: component, block, template or piece. Leave out for all.' };
const readOnly = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };

export function createRegistry(load) {
    let cached = null;
    const index = async () => {
        if (cached) return cached;
        let raw;
        try {
            raw = await load('llms/index.json');
        } catch (error) {
            throw fail(`The registry index is not available (${error.message}). Build it with \`pnpm registry && pnpm llms\`.`);
        }
        return (cached = JSON.parse(raw));
    };
    const pool = (data, kind) => (kind ? picks[kind](data) : KINDS.flatMap((name) => picks[name](data)));
    const install = (data, name) => data.install.replace('<name>', name);

    const tools = [
        {
            name: 'search_registry',
            title: 'Search the registry',
            description: 'Search Company OS components, blocks, templates and standard pieces by keywords (e.g. "audit log csv", "webhook retry", "reason dialog"). Every word must match; names weigh most, then tags, then descriptions. Returns the best matches, one per line, as "name (kind) — Title: tagline". Pass a name to get_component, get_composition or get_piece for the full doc.',
            inputSchema: {
                type: 'object',
                properties: {
                    query: { type: 'string', description: 'Keywords, e.g. "status pill" or "data-table".' },
                    kind: kindProp,
                    limit: { type: 'integer', minimum: 1, maximum: MAX_LIMIT, default: 10, description: 'How many matches to return.' },
                },
                required: ['query'],
            },
            annotations: { title: 'Search the registry', ...readOnly },
            run: async (args) => {
                const query = stringArg(args, 'query', { required: true });
                const kind = kindArg(args);
                const limit = limitArg(args);
                const terms = [...new Set(words(query))];
                if (!terms.length) throw fail('The query has no searchable words. Use letters or digits (e.g. "audit log"), or call list_registry to see everything.');
                const data = await index();
                const ranked = pool(data, kind)
                    .map((item) => ({ item, score: score(item, terms, slug(query)) }))
                    .filter((row) => row.score > 0)
                    .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name))
                    .slice(0, limit);
                if (ranked.length) return text(ranked.map((row) => line(row.item)).join('\n'));
                const scope = kind ? ` among ${kind}s` : '';
                return text(`Nothing matches "${query}"${scope}. Every word must match, so try fewer or broader words${kind ? ', drop the kind' : ''}, or call list_registry.`);
            },
        },
        {
            name: 'list_registry',
            title: 'List the registry',
            description: 'List every Company OS item (components, blocks, templates, pieces), or every item of one kind, one per line as "name (kind) — Title: tagline".',
            inputSchema: { type: 'object', properties: { kind: kindProp } },
            annotations: { title: 'List the registry', ...readOnly },
            run: async (args) => {
                const kind = kindArg(args);
                const items = pool(await index(), kind);
                return text(items.length ? items.map(line).join('\n') : `No ${kind ?? 'item'}s in this registry.`);
            },
        },
        {
            name: 'get_component',
            title: 'Get a component',
            description: 'The full doc for one component: when to use it, props, examples, accessibility, don\'ts, and the shadcn install command. Accepts the registry name ("data-table") or the export title ("DataTable").',
            inputSchema: { type: 'object', properties: { name: { type: 'string', description: 'Registry name, e.g. "data-table", or title, e.g. "DataTable".' } }, required: ['name'] },
            annotations: { title: 'Get a component', ...readOnly },
            run: async (args) => {
                const name = stringArg(args, 'name', { required: true });
                const data = await index();
                const wanted = name.toLowerCase();
                const item = data.components.find((entry) => entry.name === wanted || entry.title.toLowerCase() === wanted || entry.name === slug(name));
                if (!item) {
                    const composition = data.compositions.find((comp) => comp.name === wanted || comp.name.replace(/^(block|template)-/, '') === wanted);
                    if (composition) throw fail(`"${name}" is a ${composition.kind}, not a component. Use get_composition.`);
                    throw fail(`No component "${name}". Use search_registry or list_registry with kind "component".`);
                }
                return text(`Install: ${install(data, item.name)}\n\n${await load(item.doc)}`);
            },
        },
        {
            name: 'get_composition',
            title: 'Get a block or template',
            description: 'One block or template: what it shows, the standard pieces it implements, the components it needs, and the install command. Accepts the full name ("template-audit-log-page") or the bare one ("audit-log-page").',
            inputSchema: { type: 'object', properties: { name: { type: 'string', description: 'e.g. "template-audit-log-page" or "audit-log-page".' } }, required: ['name'] },
            annotations: { title: 'Get a block or template', ...readOnly },
            run: async (args) => {
                const name = stringArg(args, 'name', { required: true }).toLowerCase();
                const data = await index();
                const item = data.compositions.find((comp) => comp.name === name || comp.name.replace(/^(block|template)-/, '') === name || slug(comp.title) === slug(name));
                if (!item) {
                    if (data.components.some((entry) => entry.name === name)) throw fail(`"${name}" is a component, not a block or template. Use get_component.`);
                    throw fail(`No block or template "${name}". Use search_registry, or list_registry with kind "block" or "template".`);
                }
                const pieces = (item.pieces ?? []).map((n) => data.pieces.find((piece) => piece.n === n)?.name).filter(Boolean);
                return text([`# ${item.title} (${item.kind})`, item.tagline, item.description, `Pieces: ${pieces.join(', ') || 'none'}`, `Uses: ${(item.deps ?? []).join(', ') || 'none'}`, `Install: ${install(data, item.name)}`].filter(Boolean).join('\n\n'));
            },
        },
        {
            name: 'get_piece',
            title: 'Get a piece of the standard',
            description: 'One piece of the Company OS standard: the server recipe (rule, shape, code, tests, gotchas) and the components that implement it. Pass a slug like "webhooks", a number like "12", or "standard" for the overview of all pieces.',
            inputSchema: { type: 'object', properties: { piece: { type: 'string', description: 'Slug ("webhooks"), number ("12"), or "standard".' } }, required: ['piece'] },
            annotations: { title: 'Get a piece of the standard', ...readOnly },
            run: async (args) => {
                const piece = stringArg(args, 'piece', { required: true }).toLowerCase().replace(/^#/, '');
                if (piece === 'standard' || piece === 'overview') return text(await load('llms/pieces/standard.md'));
                const data = await index();
                const item = data.pieces.find((entry) => entry.name === piece || String(entry.n) === piece || entry.name === slug(piece) || entry.title.toLowerCase() === piece);
                if (!item) throw fail(`No piece "${piece}". Pieces (1–${data.pieces.length}): ${data.pieces.map((entry) => `${entry.n} ${entry.name}`).join(', ')}.`);
                const components = item.components?.length ? `\n\nComponents: ${item.components.join(', ')}` : '';
                return text(`${await load(item.doc)}${components}`);
            },
        },
    ];

    const listed = tools.map(({ run: _run, ...tool }) => tool);

    async function handle(message) {
        const { id, method } = message;
        const params = message.params ?? {};
        switch (method) {
            case 'initialize': {
                const asked = params.protocolVersion;
                return {
                    protocolVersion: PROTOCOLS.includes(asked) ? asked : PROTOCOL,
                    capabilities: { tools: { listChanged: false } },
                    serverInfo: { name: 'company-os-registry', title: 'Company OS registry', version: VERSION },
                    instructions: INSTRUCTIONS,
                };
            }
            case 'ping':
                return {};
            case 'tools/list':
                return { tools: listed };
            case 'tools/call': {
                const tool = tools.find((candidate) => candidate.name === params.name);
                if (!tool) throw rpcError(-32602, `Unknown tool "${params.name}". Tools: ${tools.map((t) => t.name).join(', ')}.`);
                const args = params.arguments ?? {};
                if (typeof args !== 'object' || Array.isArray(args)) throw rpcError(-32602, 'Tool arguments must be an object.');
                try {
                    return await tool.run(args);
                } catch (error) {
                    return { ...text(error.user ? error.message : `Registry error: ${error.message}`), isError: true };
                }
            }
            default:
                if (id === undefined) return undefined; // notifications (initialized, cancelled, ...) need no answer
                throw rpcError(-32601, `Method not found: ${method}`);
        }
    }

    // One JSON-RPC message in, one response object out (or undefined for notifications and stray responses).
    async function respond(message) {
        if (!message || typeof message !== 'object' || Array.isArray(message)) return { jsonrpc: '2.0', id: null, error: { code: -32600, message: 'Invalid Request' } };
        const id = message.id;
        const validId = id === undefined || id === null || typeof id === 'string' || typeof id === 'number';
        if (typeof message.method !== 'string') {
            if ('result' in message || 'error' in message) return undefined; // a response from the client: nothing to say
            return { jsonrpc: '2.0', id: validId ? (id ?? null) : null, error: { code: -32600, message: 'Invalid Request: method must be a string' } };
        }
        if (!validId) return { jsonrpc: '2.0', id: null, error: { code: -32600, message: 'Invalid Request: id must be a string or number' } };
        try {
            const result = await handle(message);
            return id === undefined || result === undefined ? undefined : { jsonrpc: '2.0', id, result };
        } catch (error) {
            return id === undefined ? undefined : { jsonrpc: '2.0', id, error: { code: error.code ?? -32603, message: error.message } };
        }
    }

    // A parsed body: one message or a batch. Returns the response(s), or undefined when there is nothing to send.
    async function dispatch(body) {
        if (!Array.isArray(body)) return respond(body);
        if (!body.length) return { jsonrpc: '2.0', id: null, error: { code: -32600, message: 'Invalid Request: empty batch' } };
        const replies = (await Promise.all(body.map(respond))).filter(Boolean);
        return replies.length ? replies : undefined;
    }

    return { tools: listed, handle, respond, dispatch };
}
