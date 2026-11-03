const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// expo-sqlite on web loads a WebAssembly build of SQLite.
config.resolver.assetExts.push("wasm");

// expo-sqlite's wasm build needs SharedArrayBuffer, which requires the page
// to be cross-origin isolated. These headers only cover `expo start --web`;
// production hosting (Azure) needs the same headers set at the server/CDN.
config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    middleware(req, res, next);
  };
};

module.exports = config;
