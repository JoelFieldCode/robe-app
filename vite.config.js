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
        runtimeCaching: [
          {
            handler: ({ event }) => {
              const validStr = (str) => str ? true : false
              /*
                Could we make the event wait until we have the form data first?
                Worried with this approach the FE could miss getting the post message before the form renders..
                Though now that ShareItem will wait until the service worker message runs so it's a bit safer now
              */
              event.waitUntil(
                (async function () {
                  const formData = await event.request.formData();
                  const client = await self.clients.get(
                    event.resultingClientId || event.clientId
                  );

                  const file = formData.get("file") ?? null;
                  const title = validStr(formData.get("title")) ? formData.get("title") : null;
                  const text = validStr(formData.get("text")) ? formData.get("text") : null;
                  const url = validStr(formData.get("url")) ? formData.get("url") : null;

                  client.postMessage({
                    file,
                    title,
                    text,
                    url,
                    action: "load-image",
                  });
                })()
              );

              return Response.redirect("/share-item", 303)
            },
            urlPattern: "/share-item",
            method: "POST",
          },
        ],
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
          method: "POST",
          enctype: "multipart/form-data",
          params: {
            title: "title",
            text: "text",
            url: "url",
            files: [
              {
                name: "file",
                accept: ["image/*"],
              },
            ],
          },
        },
        start_url: "/",
        display: "minimal-ui",
      },
    }),
  ],
  server: {
    port: "3000",
  },
});
