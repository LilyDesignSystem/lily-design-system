import { defineConfig } from "vitest/config";
import solid from "vite-plugin-solid";
export default defineConfig({
  plugins: [solid()],
  resolve: { conditions: ["development", "browser"] },
  test: { environment: "jsdom", globals: true, include: ["src/**/*.test.tsx"], setupFiles: ["./setup.ts"], server: { deps: { inline: [/solid-js/, /@solidjs/] } } },
});
