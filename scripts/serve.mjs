import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { networkInterfaces } from 'node:os';

const root = fileURLToPath(new URL('../', import.meta.url));
const production = process.argv.includes('--production');
const roots = production ? [resolve(root, 'dist')] : [resolve(root, 'src'), resolve(root, 'public')];
const port = Number(process.env.PORT || 4173);
const host = process.argv.includes('--host') ? '0.0.0.0' : '127.0.0.1';
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.pdf': 'application/pdf' };

const server = createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch { res.writeHead(400).end('Bad request'); return; }
  if (pathname === '/') pathname = '/index.html';
  for (const directory of roots) {
    const filename = resolve(directory, `.${pathname}`);
    if (!filename.startsWith(directory + sep)) continue;
    try {
      const content = await readFile(filename);
      res.writeHead(200, { 'Content-Type': types[extname(filename)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
      res.end(req.method === 'HEAD' ? undefined : content);
      return;
    } catch (error) {
      if (!['ENOENT', 'ENOTDIR', 'EISDIR'].includes(error.code)) console.error(error.message);
    }
  }
  res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
});
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
server.listen(port, host, () => {
  console.log(`Local: http://127.0.0.1:${port}`);
  if (host === '0.0.0.0') {
    for (const address of Object.values(networkInterfaces()).flat()) {
      if (address?.family === 'IPv4' && !address.internal) {
        console.log(`Network: http://${address.address}:${port}`);
      }
    }
  }
});
