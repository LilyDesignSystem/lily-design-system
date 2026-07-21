#!/usr/bin/env node
// Build pipeline for the publishable Vue helper sub-packages.
//
// Vue SFCs need the Vue compiler, so each sub-package is built with Vite
// library mode (see vite.lib.config.ts) to emit `<pkg>/dist/index.js`,
// then `vue-tsc` emits matching `.d.ts` declarations into `<pkg>/dist`.
//
// Run from the catalog root: `npm run build` / `pnpm build`.
import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));

/**
 * Discover the publishable sub-packages.
 *
 * A sub-package is any child directory that has both a `package.json`
 * (it is a package) and an `index.ts` (it has code to build — that is
 * the entry `vite.lib.config.ts` and `vue-tsc` both compile).
 *
 * This is deliberately *not* a hardcoded list. A hardcoded list has
 * already gone stale once during a rename and published a package with
 * an empty `dist/`: the list still named the old directory, the build
 * silently skipped the new one, and nothing failed loudly. Discovery
 * makes adding or renaming a helper a no-op here.
 */
function discoverPackages() {
  const found = readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter(
      (name) =>
        existsSync(join(root, name, "package.json")) &&
        existsSync(join(root, name, "index.ts")),
    )
    // Sorted so build order — and therefore build output — is stable.
    .sort();

  if (found.length === 0) {
    throw new Error(
      `No publishable sub-packages found in ${root}. ` +
        "Each one needs both a package.json and an index.ts.",
    );
  }
  return found;
}

const packages = discoverPackages();
console.log(`Discovered ${packages.length} sub-package(s):`);
for (const pkg of packages) console.log(`  - ${pkg}`);

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

  // 3. Assert the package actually produced code. `files` in each
  //    package.json ships `dist/`, so an empty or missing dist would
  //    publish a package that installs but exports nothing — the exact
  //    failure the hardcoded package list caused before. Fail loudly
  //    here instead of at `npm publish` time.
  for (const artifact of ["index.js", "index.d.ts"]) {
    const file = resolve(pkgDir, "dist", artifact);
    if (!existsSync(file) || statSync(file).size === 0) {
      throw new Error(
        `${pkg}: expected a non-empty dist/${artifact} after build, ` +
          `but it is missing or empty. Refusing to continue.`,
      );
    }
  }
}

console.log(`\nAll ${packages.length} Vue helper sub-packages built.`);
