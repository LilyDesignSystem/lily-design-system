import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["components/*.test.js"],
    setupFiles: ["./vitest-setup.js"],
  },
});
