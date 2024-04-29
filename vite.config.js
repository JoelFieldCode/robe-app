import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
      },
      includeAssets: ["./src/assets/favicon.ico", "./src/assets/logo192.png"],
      manifest: {
        name: "Robe",
        short_name: "Robe",
        description: "Add items to your Robe",
        theme_color: "93c47d",
        background_color: "#ffffff",
        icons: [
          {
            src: "./src/assets/logo192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "./src/assets/logo512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        start_url: "/",
        display: "fullscreen",
      },
    }),
  ],
  server: {
    port: "3000",
  },
});
