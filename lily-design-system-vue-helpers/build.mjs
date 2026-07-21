#!/usr/bin/env node
// Build pipeline for the publishable Vue helper sub-packages.
//
// Vue SFCs need the Vue compiler, so each sub-package is built with Vite
// library mode (see vite.lib.config.ts) to emit `<pkg>/dist/index.js`,
// then `vue-tsc` emits matching `.d.ts` declarations into `<pkg>/dist`.
//
// Run from the catalog root: `npm run build` / `pnpm build`.
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));

// The publishable sub-packages, in dependency-free order.
const packages = [
  "lily-design-system-vue-theme-select",
  "lily-design-system-vue-locale-select",
  "lily-design-system-vue-text-size-select",
  "lily-design-system-vue-share-button",
];

function run(cmd, args, env) {
  execFileSync(cmd, args, {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
}

for (const pkg of packages) {
  const pkgDir = resolve(root, pkg);
  console.log(`\n=== Building ${pkg} ===`);

  // 1. Compile the SFC + helpers into dist/index.js via Vite lib mode.
  run("npx", ["vite", "build", "--config", "vite.lib.config.ts"], {
    LILY_PKG: pkg,
  });

  // 2. Emit .d.ts declarations into dist/ via vue-tsc. We generate a
  //    throwaway tsconfig that includes only this package's source so
  //    rootDir/outDir resolve cleanly to <pkg>/dist.
  const tmp = mkdtempSync(join(tmpdir(), "lily-vue-tsc-"));
  const tsconfigPath = join(tmp, "tsconfig.json");
  writeFileSync(
    tsconfigPath,
    JSON.stringify(
      {
        extends: resolve(root, "tsconfig.lib.json"),
        compilerOptions: {
          rootDir: pkgDir,
          outDir: resolve(pkgDir, "dist"),
        },
        // Only the public barrel; vue-tsc follows its imports (the SFC
        // and any sibling .ts modules) automatically. Listing the whole
        // tree would drag in examples/, docs/, and tests, which depend
        // on framework globals (Nuxt, vitest) that aren't compiled here.
        include: [resolve(pkgDir, "index.ts")],
        exclude: [
          resolve(pkgDir, "**/*.test.ts"),
          resolve(pkgDir, "examples"),
          resolve(pkgDir, "docs"),
          resolve(pkgDir, "dist"),
        ],
      },
      null,
      2,
    ),
  );
  try {
    run("npx", ["vue-tsc", "-p", tsconfigPath, "--emitDeclarationOnly"]);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}

console.log("\nAll Vue helper sub-packages built.");
