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
      react: resolveFromRoot("./node_modules/react"),
      "react-dom": resolveFromRoot("./node_modules/react-dom"),
      "react-router": resolveFromRoot("./node_modules/react-router"),
      "react-router-dom": resolveFromRoot("./node_modules/react-router-dom"),
      "@tanstack/react-query": resolveFromRoot("./node_modules/@tanstack/react-query"),
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
