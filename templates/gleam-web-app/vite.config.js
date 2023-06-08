import { execSync } from "node:child_process";
import * as path from "node:path";
import { defineConfig } from "vite";

const gleamRegex = /\.(gleam)$/;

export default defineConfig({
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "./assets"),
    },
  },
  build: {
    watch: {
      include: ["build/dev/javascript/**", "src/**"],
    },
    sourcemap: true,
  },
  plugins: [
    {
      name: "vite-gleam",
      handleHotUpdate(ctx) {
        // console.log(ctx.file);
        if (path.join(__dirname, "src").includes(path.join(ctx.file, ".."))) {
          console.log("$ gleam build");
          const out = execSync("gleam build");
          console.log(out.toString("utf-8"));
        }
      },
      async resolveId(source, importer, options) {
        if (gleamRegex.test(source)) {
          return {
            id: path.join(importer, "../", source).replace(gleamRegex, ".mjs"),
          };
        }
      },
    },
  ],
});
