# Angular + Analog build and SSG notes

Verbatim engineering log relocated from the root spec (`spec/index.md`
§11.8) on 2026-07-03. It records the end-to-end verification of the
Angular subprojects and the diagnosis of the Analog SSG issue; see
[analog-ssg-issue.md](analog-ssg-issue.md) for the distilled upstream
issue draft.

- [/] Angular subprojects end-to-end verification — partial:
      - **angular-headless** (2026-05-29): `pnpm install` works once
        `@analogjs/vite-plugin-angular` is pinned to `1.19.4` (the
        1.22+ line requires Vite 6 via `defaultClientConditions`) and
        `@angular/build` is added as a direct devDep. `vitest run`
        passes **974 / 974** across **490 / 490** spec files. `pnpm
        build` (ng-packagr) emits the APF bundle cleanly. Source fix:
        all `($event.target as HTMLInputElement).value` patterns
        rewritten to `$any($event.target).value` because Angular
        template parsing rejects parenthesised TS casts inside method
        calls.
      - **angular-examples** (2026-05-30): `pnpm install` resolves
        with both `@analogjs/{platform,router,vite-plugin-angular}`
        pinned to `1.19.4` plus `pnpm-workspace.yaml` overrides
        (pnpm 11 ignores `pnpm.overrides` in package.json — they
        must live in `pnpm-workspace.yaml`) forcing both
        `@analogjs/vite-plugin-{angular,nitro}` onto `1.19.4`. Same
        template-cast fix applied to the copied components. SSR
        scaffolding shipped: `index.html`, `src/main.server.ts`
        (default-exports `render(url, document)` per the Analog
        renderer contract documented in
        `@analogjs/vite-plugin-nitro/src/lib/runtime/renderer.ts`),
        `src/app/app.config.server.ts`, `vite.config.ts` with
        explicit `build.outDir: "dist/client"` (the analog plugin
        reads `config.build?.outDir || 'dist/client'` but Vite's
        default `"dist"` already wins, so the explicit override is
        needed). `pnpm run build` now: (a) builds the client into
        `dist/client/` cleanly, (b) tries to bundle SSR but the
        analog vite-plugin-angular transform consumes
        `main.server.ts` and returns empty code — output is exactly
        1 byte regardless of source. Confirmed isolation: a plain
        `vite build --ssr src/main.server.ts` without the analog
        plugin produces a working 2 KB bundle with the default
        export intact. Likely root cause: the angular plugin's
        `fileEmitter(id)` returns no compiled content for files not
        in the Angular project's initial compilation set, despite
        `src/main.server.ts` being inside the tsconfig's `src/**/*.ts`
        include. Tried `analog({ vite: { transformFilter } })` to
        bypass the plugin transform for the SSR entry — that lets
        Rollup parse main.server.ts directly, but then the
        transitive `./app/app` import fails because the same plugin
        state issue empties `app.ts`'s `App` export inside the
        separate Vite instance `buildSSRApp` spawns. Remaining work:
        file an Analog upstream issue, or switch the example app
        off Analog onto a vanilla Angular + Vite + esbuild +
        prerender pipeline.
      - **2026-06-14 — root cause narrowed.** The failure is broader
        than an emptied SSR entry: `@analogjs/vite-plugin-angular@1.19.4`
        emits **no compiled Angular output at all** under Angular 20,
        for the client build as well as SSR. After `pnpm build` the
        client entry `dist/client/assets/index-*.js` is ~0.7 KB and
        contains only Vite's `modulepreload` polyfill — no
        `bootstrapApplication`, no `@angular/*` runtime, no `main.ts`
        code; `dist/client` totals ~8 KB and `dist/ssr/main.server.js`
        is one byte (`\n`). The plugin's `fileEmitter` returns empty
        for every project `.ts` (not just `main.server.ts`), so this
        is an Analog 1.19.4 ↔ Angular 20 compiler-integration
        incompatibility, not an SSR-entry bug. Fixes ruled out, each
        leaving the bundle empty: (a) adding
        `files: ["src/main.ts", "src/main.server.ts"]` to
        `tsconfig.json` (the Analog template shape — kept, since it is
        the correct config and a prerequisite once the plugin works,
        but insufficient alone); (b) the earlier `transformFilter`
        bypass; (c) SPA mode (`analog({ ssr: false })`) — builds green
        (exit 0) but still emits an empty client app. Resolution
        requires a dependency-line change, not a config tweak. Options,
        in rough order of preference: (1) move Analog to the Vite-6
        line (1.22+) that targets Angular 20 and bump Vite 5 → 6;
        (2) pin Angular to 18/19 to match Analog 1.19.4; or (3) drop
        Analog for the first-party `@angular/build:application` builder
        plus a prerender step (loses Analog file-based routing —
        `provideFileRouter()` would become explicit routes).
      - **2026-06-15 — build fixed (option 1 taken); one issue
        remains.** Upgraded Analog `1.19.4 → 1.22.5` and Vite
        `5 → 6.4.3` (workspace overrides bumped to `1.22.5`), then
        fixed four real defects the working compiler then surfaced.
        (1) **Root cause was a missing `tsconfig.app.json`** — the
        Angular Vite plugin defaults to that filename and logged
        `Unable to resolve tsconfig at .../tsconfig.app.json`, so its
        program had no root files and emitted nothing; adding
        `tsconfig.app.json` (extends `tsconfig.json`,
        `files: ["src/main.ts","src/main.server.ts"]`) made it compile
        (1 → 323 client + 105 SSR modules). The earlier `files`-in-
        `tsconfig.json` edit was reverted in favour of this. (2)
        `provideExperimentalZonelessChangeDetection` →
        `provideZonelessChangeDetection` (graduated in Angular 20). (3)
        Dropped `import "zone.js/node"` from `main.server.ts` (the app
        is zoneless). (4) **NG0401 (`PLATFORM_NOT_FOUND`)** during
        prerender — Angular 20 passes a `BootstrapContext` to the SSR
        bootstrap and requires it forwarded:
        `(context) => bootstrapApplication(App, config, context)`.
        Result: `pnpm build` now exits 0 and prerenders **506/506**
        routes with **0 errors** (`dist/analog/public`, ~2.4 MB; was a
        1-byte SSR entry + failed build). **Route discovery — root
        caused to an upstream Analog bug.** Analog's `analog-glob-routes`
        plugin globs the page files (confirmed: `routeFiles=15`, correct
        `root`) and injects them by a *brittle string* replace,
        `code.replace('ANALOG_ROUTE_FILES = {};', …)`, on the
        `@analogjs/router` module. The transform runs in every build
        pass, but in some passes an earlier transform reformats /
        minifies that exact literal first, so the replace silently
        misses and the route set stays empty (instrumented: the same
        pass shows `routeFiles=15` yet `hasExactTarget=false`). Adding
        `optimizeDeps.exclude: ['@analogjs/router']` (plus
        `ssr.noExternal`) keeps the literal intact for the **client**
        build — the page components now bundle and the app renders
        client-side after bootstrap — but the **SSR/prerender** pass
        still reformats it (the identifier is renamed there, so no
        string-replace workaround applies), leaving the prerendered
        HTML as the app shell that hydrates to full content on the
        client. Net: the example app builds and works as a client-
        rendered SPA; static SSG content is still shell-only. Closing
        it fully needs an upstream fix (make Analog's replace robust /
        AST-based) — file an `@analogjs/platform` issue — or moving the
        SSG step onto `@angular/build:application`'s prerenderer.
      - Playwright e2e suites not yet exercised against either app.

---

Lily™ and Lily Design System™ are trademarks.
