import path from "path";

import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { checker } from "vite-plugin-checker";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    nodePolyfills(),
    tsconfigPaths({ projects: ["./"] }),
    checker({
      typescript: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
