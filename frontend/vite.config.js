import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      "/chat": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
