#!/usr/bin/env node
// Company OS registry MCP over stdio (newline-delimited JSON-RPC 2.0). Zero dependencies.
// The tools live in ./registry.mjs; the deployed site serves the same tools at POST /mcp.
//
//   node mcp/server.mjs                                   reads ./public (run `pnpm llms && pnpm registry` first)
//   COMPANY_OS_REGISTRY=https://your.domain node mcp/server.mjs   reads a deployed site

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';
import { createRegistry } from './registry.mjs';

const SOURCE = process.env.COMPANY_OS_REGISTRY ?? path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');
const REMOTE = /^https?:\/\//.test(SOURCE);

async function load(rel) {
    if (!REMOTE) return readFile(path.join(SOURCE, rel), 'utf8');
    const response = await fetch(new URL(rel, SOURCE.endsWith('/') ? SOURCE : `${SOURCE}/`));
    if (!response.ok) throw new Error(`${rel}: HTTP ${response.status}`);
    return response.text();
}

const registry = createRegistry(load);
const send = (payload) => process.stdout.write(`${JSON.stringify(payload)}\n`);

createInterface({ input: process.stdin }).on('line', async (raw) => {
    if (!raw.trim()) return;
    let message;
    try {
        message = JSON.parse(raw);
    } catch {
        return send({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } });
    }
    const reply = await registry.dispatch(message);
    if (reply !== undefined) send(reply);
});
