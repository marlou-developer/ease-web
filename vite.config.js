import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    laravel({
      input: "resources/js/app.jsx",
      refresh: true,
    }),
    react(),
  ],
  resolve: {
    alias: {
      "@digitalpersona/devices": "@digitalpersona/devices/dist/es5/devices.js",
      "@digitalpersona/core": "@digitalpersona/core/dist/es5/index.js",
    },
  },
  optimizeDeps: {
    exclude: ["@digitalpersona/devices", "@digitalpersona/core"],
  },
  ssr: {
    noExternal: ["@digitalpersona/devices", "@digitalpersona/core"],
  },
});
