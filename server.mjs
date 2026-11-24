import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRegistry } from './mcp/registry.mjs';

const ROOT = fileURLToPath(new URL('./dist', import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const CORS = /^\/(r|llms)\//;
const MAX_BODY = 1 << 20;

// The registry MCP over Streamable HTTP, stateless: POST /mcp with one JSON-RPC message or a batch, JSON back.
const registry = createRegistry((rel) => readFile(join(ROOT, normalize(rel).replace(/^(\.\.[/\\])+/, '')), 'utf8'));
const MCP_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Mcp-Session-Id, Mcp-Protocol-Version, Authorization',
    'Access-Control-Expose-Headers': 'Mcp-Session-Id',
};

async function readBody(req) {
    let size = 0;
    const chunks = [];
    for await (const chunk of req) {
        size += chunk.length;
        if (size > MAX_BODY) throw Object.assign(new Error('Payload too large'), { status: 413 });
        chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString('utf8');
}

async function mcp(req, res) {
    const json = (status, payload) => res.writeHead(status, { ...MCP_HEADERS, 'Content-Type': 'application/json; charset=utf-8' }).end(JSON.stringify(payload));
    if (req.method === 'OPTIONS') return res.writeHead(204, MCP_HEADERS).end();
    if (req.method === 'DELETE') return res.writeHead(204, MCP_HEADERS).end();
    if (req.method !== 'POST') return res.writeHead(405, { ...MCP_HEADERS, Allow: 'POST, OPTIONS' }).end('POST JSON-RPC to /mcp');
    let message;
    try {
        message = JSON.parse(await readBody(req));
    } catch (error) {
        if (error.status) return json(error.status, { jsonrpc: '2.0', id: null, error: { code: -32600, message: error.message } });
        return json(400, { jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } });
    }
    const batch = Array.isArray(message);
    const replies = (await Promise.all((batch ? message : [message]).map((one) => registry.respond(one)))).filter(Boolean);
    if (replies.length === 0) return res.writeHead(202, MCP_HEADERS).end();
    return json(200, batch ? replies : replies[0]);
}

const TYPE = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.md': 'text/markdown; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.png': 'image/png',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.map': 'application/json; charset=utf-8',
};

async function resolve(urlPath) {
    const rel = normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
    let file = join(ROOT, rel);
    if (!file.startsWith(ROOT)) return null;
    try {
        if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
        await stat(file);
        return file;
    } catch {
        return extname(rel) ? null : join(ROOT, 'index.html');
    }
}

const server = createServer(async (req, res) => {
    const path = req.url || '/';
    if (path.split('?')[0] === '/mcp') return mcp(req, res).catch(() => res.writeHead(500).end('Server error'));
    const file = await resolve(path);
    if (!file) return res.writeHead(404).end('Not found');
    try {
        const body = await readFile(file);
        const headers = { 'Content-Type': TYPE[extname(file)] || 'application/octet-stream' };
        if (CORS.test(path) || path === '/llms.txt') {
            headers['Access-Control-Allow-Origin'] = '*';
            headers['Cache-Control'] = 'public, max-age=300';
        } else if (path.startsWith('/assets/')) {
            headers['Cache-Control'] = 'public, max-age=31536000, immutable';
        }
        res.writeHead(200, headers).end(body);
    } catch {
        res.writeHead(500).end('Server error');
    }
});

server.listen(PORT, '0.0.0.0', () => console.log(`Company OS serving dist/ on :${PORT}`));
