import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true, // Enables LAN access via Wi-Fi IP (10.58.17.103)
    port: 5173,
    proxy: {
      // Auth microservice on port 8081
      "/api/auth": {
        target: "http://localhost:8081",
        changeOrigin: true,
      },
      // Business microservice on port 8082
      "/api/business": {
        target: "http://localhost:8082",
        changeOrigin: true,
      },
      // Default fallback
      "/api": {
        target: "http://localhost:8082",
        changeOrigin: true,
      },
    },
  },
});