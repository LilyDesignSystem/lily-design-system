import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "@pgds": path.resolve(
        __dirname,
        "../lily-design-system-react-headless/components",
      ),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
    exclude: ["**/node_modules/**", "**/.next/**", "**/e2e/**", "**/*.stories.*"],
  },
});
