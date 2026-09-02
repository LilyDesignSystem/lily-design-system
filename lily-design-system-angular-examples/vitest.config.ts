import { defineConfig } from "vitest/config";
import angular from "@analogjs/vite-plugin-angular";

// Vitest configuration for this example app: both its own top-level
// logic (the /components search's suffix-pattern derivation) and the
// 491 component .spec.ts files copied from lily-design-system-angular-headless
// (the standard copy-pattern). Mirrors angular-headless's own
// vitest.config.ts + vitest-setup.ts.
//
// Plan P7-T11 (closed 2026-09-02): the component specs used to run but
// fail every `fixture.componentRef.setInput(...)` assertion with
// NG0303 ("Can't set value of the 'className' input ... Make sure
// that the 'className' property is declared as an input"). The real
// cause was never the zone.js-vs-zoneless mismatch or the
// dependency-tree duplication earlier investigation notes suspected --
// it was simpler: this app had a tsconfig.json and tsconfig.app.json
// but no tsconfig.spec.json, and @analogjs/vite-plugin-angular looks
// for that file by convention to know which files are "in the TS
// program" for its Angular compiler. Without it, component .ts files
// compiled with signal inputs but without the metadata TestBed's
// setInput() needs to recognize them. Adding tsconfig.spec.json (see
// that file) fixed all 491 components' specs in one pass -- no
// per-component changes were needed.
export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
    include: ["src/app/*.spec.ts", "src/app/components/**/*.spec.ts"],
  },
});
