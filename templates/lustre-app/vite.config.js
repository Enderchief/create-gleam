import * as path from "node:path";
import { defineConfig } from "vite";
import gleam from "vite-gleam";

export default defineConfig({
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "./assets"),
    },
  },
  build: {
    sourcemap: true,
  },
  plugins: [gleam()],
});
