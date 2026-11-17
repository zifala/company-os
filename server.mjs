import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve as resolvePath, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PROTOCOLS, createRegistry } from './mcp/registry.mjs';

// COMPANY_OS_DIST points the server at another build (e.g. a scratch copy of public/ for testing).
const ROOT = resolvePath(process.env.COMPANY_OS_DIST || fileURLToPath(new URL('./dist', import.meta.url)));
const PORT = Number(process.env.PORT) || 3000;
const CORS = /^\/(r|llms)\//;
const MCP_PATH = /^\/mcp\/?$/;
const MCP_MAX_BODY = 1024 * 1024;
const MCP_CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization, MCP-Protocol-Version, Mcp-Session-Id, Last-Event-ID',
    'Access-Control-Expose-Headers': 'MCP-Protocol-Version, Mcp-Session-Id',
    'Access-Control-Max-Age': '86400',
};

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

// The registry MCP over Streamable HTTP: stateless, JSON responses, reading the built llms/ in dist/.
const registry = createRegistry(async (rel) => {
    const file = resolvePath(ROOT, rel);
    if (!file.startsWith(ROOT + sep)) throw new Error(`${rel}: outside the build`);
    try {
        return await readFile(file, 'utf8');
    } catch {
        throw new Error(`${rel}: not found`);
    }
});

function readBody(req) {
    return new Promise((done, failed) => {
        const chunks = [];
        let size = 0;
        const onData = (chunk) => {
            size += chunk.length;
            if (size <= MCP_MAX_BODY) return chunks.push(chunk);
            // Stop buffering, drain the rest, and answer 413 with Connection: close.
            req.off('data', onData);
            req.resume();
            failed(Object.assign(new Error('Body too large'), { status: 413 }));
        };
        req.on('data', onData);
        req.on('end', () => done(Buffer.concat(chunks).toString('utf8')));
        req.on('error', failed);
    });
}

async function mcp(req, res) {
    const json = (status, payload, extra = {}) => res.writeHead(status, { ...MCP_CORS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extra }).end(JSON.stringify(payload));
    const rpcError = (status, code, message, extra) => json(status, { jsonrpc: '2.0', id: null, error: { code, message } }, extra);
    if (req.method === 'OPTIONS') return res.writeHead(204, MCP_CORS).end();
    // Stateless: no server-initiated stream to GET, no session to DELETE.
    if (req.method !== 'POST') return res.writeHead(405, { ...MCP_CORS, Allow: 'POST, OPTIONS', 'Content-Type': 'text/plain; charset=utf-8' }).end('Method not allowed. POST JSON-RPC to /mcp.');
    if (Number(req.headers['content-length']) > MCP_MAX_BODY) return rpcError(413, -32600, 'Request body too large (1 MB max)', { Connection: 'close' });
    // Lenient: a missing or unknown MCP-Protocol-Version is served, not refused; a known one is echoed back.
    const asked = req.headers['mcp-protocol-version'];
    const version = PROTOCOLS.includes(asked) ? { 'MCP-Protocol-Version': asked } : {};
    let raw;
    try {
        raw = await readBody(req);
    } catch (error) {
        return rpcError(error.status ?? 400, -32600, error.status === 413 ? 'Request body too large (1 MB max)' : 'Could not read the request body', { Connection: 'close' });
    }
    let body;
    try {
        body = JSON.parse(raw);
    } catch {
        return rpcError(400, -32700, 'Parse error');
    }
    const reply = await registry.dispatch(body);
    if (reply === undefined) return res.writeHead(202, { ...MCP_CORS, ...version, 'Content-Length': '0' }).end();
    return json(200, reply, version);
}

const server = createServer(async (req, res) => {
    const path = req.url || '/';
    if (MCP_PATH.test(path.split('?')[0])) {
        return mcp(req, res).catch(() => {
            if (!res.headersSent) res.writeHead(500, MCP_CORS).end();
        });
    }
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

server.listen(PORT, '0.0.0.0', () => console.log(`Company OS serving ${ROOT} on :${PORT} (registry MCP at /mcp)`));
