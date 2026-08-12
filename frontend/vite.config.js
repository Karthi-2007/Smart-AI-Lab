import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    basicSsl(),
  ],
  server: {
    host: true, // Enables LAN access via Wi-Fi IP (10.58.17.103)
    port: 5173,
    https: true, // Enables HTTPS for mobile camera API access
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
      },
    },
  },
});