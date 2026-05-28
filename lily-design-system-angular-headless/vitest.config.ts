import { defineConfig } from "vitest/config";
import angular from "@analogjs/vite-plugin-angular";

// Vitest configuration for the Angular headless component library.
// Uses @analogjs/vite-plugin-angular to compile Angular templates
// in test files. jsdom provides a browser-like DOM for ARIA / class
// assertions via TestBed.createComponent + ComponentFixture.

export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
    include: ["components/**/*.spec.ts"],
  },
});
