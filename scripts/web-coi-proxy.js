#!/usr/bin/env node
/**
 * Local-dev-only cross-origin-isolation proxy.
 *
 * expo-sqlite's web build needs SharedArrayBuffer, which needs the page to be
 * cross-origin isolated (COOP/COEP response headers). metro.config.js already
 * sets those on everything Metro itself serves, but `expo start --web`'s own
 * dev server answers "/" (the HTML document) through a separate middleware
 * that metro.config.js's `server.enhanceMiddleware` never sees -- so the
 * document itself isn't isolated, and expo-sqlite falls back to a
 * non-persistent mode (writes silently don't stick). See
 * docs/WEB_DEPLOYMENT.md's "Known gap" note.
 *
 * This proxy sits in front of the real dev server and stamps the headers on
 * *every* response, document included, plus WebSocket upgrades (Fast
 * Refresh/HMR). Production doesn't need this -- the Caddy deploy already sets
 * these headers on every response.
 *
 * Usage: start the dev server as usual, then point this at its port.
 *   npx expo start --web
 *   node scripts/web-coi-proxy.js            # defaults: proxy :19006 -> target :8081
 *   node scripts/web-coi-proxy.js 19006 8083  # explicit proxyPort targetPort
 * Open the PROXY port in the browser, not the Metro port.
 */
const http = require("http");
const net = require("net");

const PROXY_PORT = Number(process.argv[2]) || 19006;
const TARGET_PORT = Number(process.argv[3]) || 8081;
const TARGET_HOST = "localhost";

function withIsolationHeaders(headers) {
  return {
    ...headers,
    "Cross-Origin-Embedder-Policy": "credentialless",
    "Cross-Origin-Opener-Policy": "same-origin",
  };
}

const server = http.createServer((req, res) => {
  const upstream = http.request(
    { host: TARGET_HOST, port: TARGET_PORT, method: req.method, path: req.url, headers: req.headers },
    (upstreamRes) => {
      res.writeHead(upstreamRes.statusCode ?? 502, withIsolationHeaders(upstreamRes.headers));
      upstreamRes.pipe(res);
    }
  );
  upstream.on("error", (err) => {
    res.writeHead(502, { "Content-Type": "text/plain" });
    res.end(`Upstream dev server unreachable on port ${TARGET_PORT}: ${err.message}`);
  });
  req.pipe(upstream);
});

// Fast Refresh/HMR runs over a WebSocket -- proxy the raw TCP upgrade too.
server.on("upgrade", (req, clientSocket, head) => {
  const upstreamSocket = net.connect(TARGET_PORT, TARGET_HOST, () => {
    const rawHeaders = Object.entries(req.headers)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\r\n");
    upstreamSocket.write(`${req.method} ${req.url} HTTP/1.1\r\n${rawHeaders}\r\n\r\n`);
    if (head && head.length) upstreamSocket.write(head);
    upstreamSocket.pipe(clientSocket);
    clientSocket.pipe(upstreamSocket);
  });
  upstreamSocket.on("error", () => clientSocket.destroy());
  clientSocket.on("error", () => upstreamSocket.destroy());
});

server.listen(PROXY_PORT, () => {
  console.log(`Cross-origin-isolated proxy: http://localhost:${PROXY_PORT} -> http://localhost:${TARGET_PORT}`);
  console.log("Open the proxy URL in your browser (not the Metro port) so expo-sqlite gets a durable web store.");
});
