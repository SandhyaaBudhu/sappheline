import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/sappheline/" : "/",
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // The studio is lazy loaded; keep its rendering engine separate from the storefront.
          if (id.endsWith("/three/build/three.module.js"))
            return "three-renderer";
          if (id.endsWith("/three/build/three.core.js")) return "three-core";
        },
      },
    },
  },
  server: {
    watch: {
      // Static media does not need HMR; avoid transient binary-file locks on Windows.
      ignored: ["**/public/fonts/**", "**/public/images/**"],
    },
  },
}));
