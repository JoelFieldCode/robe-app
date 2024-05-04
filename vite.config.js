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
      includeAssets: ["favicon.ico"],
      manifest: {
        name: "Robe",
        short_name: "Robe",
        description: "Add items to your Robe",
        theme_color: "#93c47d",
        background_color: "#ffffff",
        icons: [
          {
            src: "/logo192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/logo512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        share_target: {
          action: "/share-item",
          method: "GET",
          enctype: "multipart/form-data",
          params: {
            files: [
              {
                name: "images",
                accept: ["image/*"],
              },
            ],
            title: "title",
            text: "text",
            url: "url",
          },
        },
        start_url: "/",
        display: "fullscreen",
      },
    }),
  ],
  server: {
    port: "3000",
  },
});
