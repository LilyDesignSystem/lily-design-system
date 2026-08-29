import { defineConfig } from "vitest/config";

// Vitest configuration for this example app's plain-TypeScript logic
// (currently: the /components search's suffix-pattern derivation).
// Scoped to src/app/*.spec.ts (not src/app/components/**) on purpose:
// the 491 component .spec.ts files under src/app/components/ were
// copied over from lily-design-system-angular-headless as part of the
// standard copy-pattern, but this app never received the matching
// vitest setup (Angular TestBed environment init, jsdom, the
// @analogjs/vite-plugin-angular template compiler) that
// angular-headless's own vitest.config.ts wires up -- they are not
// runnable here yet. That gap is pre-existing and out of scope for
// this change; widening `include` to run them is a separate task.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/app/*.spec.ts"],
  },
});
