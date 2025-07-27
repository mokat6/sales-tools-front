import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { visualizer } from "rollup-plugin-visualizer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({ filename: "dist/stats.html", gzipSize: true, brotliSize: true, template: "treemap", open: true }),
  ],
  server: {
    host: "0.0.0.0",
  },

  // cool imports @/components/...
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
