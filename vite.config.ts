import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "node:url";
import { componentTagger } from "lovable-tagger";

const rootDir = fileURLToPath(new URL(".", import.meta.url));
const resolveFromRoot = (target: string) => path.resolve(rootDir, target);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": resolveFromRoot("./src"),
      react: resolveFromRoot("./node_modules/react/index.js"),
      "react-dom": resolveFromRoot("./node_modules/react-dom/index.js"),
      "react/jsx-runtime": resolveFromRoot("./node_modules/react/jsx-runtime.js"),
      "react/jsx-dev-runtime": resolveFromRoot("./node_modules/react/jsx-dev-runtime.js"),
      "react-dom/client": resolveFromRoot("./node_modules/react-dom/client.js"),
      "react-dom/server": resolveFromRoot("./node_modules/react-dom/server.browser.js"),
    },
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "react-router",
      "react-router-dom",
      "@tanstack/react-query",
    ],
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "react-dom/client",
      "react-router",
      "react-router-dom",
      "@tanstack/react-query",
    ],
    force: true,
  },
}));
