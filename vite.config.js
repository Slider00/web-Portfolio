import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  base: "/web-Portfolio/", // 👈 necesario para GitHub Pages
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),     // página principal
        coins: resolve(__dirname, "coins.html"),     // nueva pestaña Coins
      },
    },
  },
});
