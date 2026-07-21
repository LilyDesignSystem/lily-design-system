import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Standalone test harness for the React helpers catalog. Each helper
// subproject (e.g. lily-design-system-react-theme-chooser) keeps its
// own `*.test.tsx` next to its component; vitest discovers them all.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
    include: ["lily-design-system-react-*/**/*.test.tsx"],
  },
});
