import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Standalone test harness for @lilydesignsystem/react-markdown-editor.
export default defineConfig({
  plugins: [react()],
  resolve: { dedupe: ["react", "react-dom"] },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
    include: ["**/*.test.tsx", "**/*.test.ts"],
    exclude: ["node_modules/**", "dist/**"],
  },
});
