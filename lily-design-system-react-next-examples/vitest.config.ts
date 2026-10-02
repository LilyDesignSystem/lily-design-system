import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      // Mirrors tsconfig.json's "@lily/*": ["./components/*"]; without it
      // every test or page that imports @lily/... fails to resolve.
      "@lily": path.resolve(__dirname, "components"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
    exclude: ["**/node_modules/**", "**/.next/**", "**/e2e/**", "**/*.stories.*"],
  },
});
