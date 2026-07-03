# Upstream issue draft — Analog route injection breaks under transform reordering

Ready-to-file issue for [analogjs/analog](https://github.com/analogjs/analog).
Distilled from the engineering log in
[analog-ssg-notes.md](analog-ssg-notes.md); update version numbers before
filing if the dependency line has moved.

---

**Title:** `analog-glob-routes` route injection silently fails when
another transform reformats the `ANALOG_ROUTE_FILES` literal (SSG output
is app shell only)

**Package:** `@analogjs/platform` / `@analogjs/vite-plugin-angular`
**Version:** 1.22.5 (Angular 20.x, Vite 6.4.3)
**Build:** file-based routing + prerender (SSG)

## Summary

Analog's `analog-glob-routes` plugin injects the discovered page files
into `@analogjs/router` with a brittle string replacement:

```js
code.replace('ANALOG_ROUTE_FILES = {};', /* …glob results… */)
```

The transform runs in every build pass, but whenever an earlier
transform reformats or minifies that exact literal first, the `replace`
silently misses and the route set stays empty. Instrumenting the plugin
shows the same pass can have `routeFiles=15` (glob is correct, `root` is
correct) and `hasExactTarget=false` (the literal is already gone).

## Observed behaviour

- The **client** build can be kept working with
  `optimizeDeps.exclude: ['@analogjs/router']` plus `ssr.noExternal` —
  the literal survives, page components bundle, and the app renders
  after client bootstrap.
- The **SSR/prerender** pass still reformats the module (the identifier
  is renamed there, so no string-based workaround applies). Prerender
  then emits every route as the app shell only; full content appears
  only after hydration, which defeats SSG.

## Expected behaviour

Route injection should not depend on the exact formatting of the
`ANALOG_ROUTE_FILES = {};` literal — e.g. inject via an AST transform,
a virtual module, or `import.meta.glob` resolved in the router itself —
or at minimum the plugin should fail loudly when the replacement target
is not found, instead of building "successfully" with zero routes.

## Reproduction sketch

Angular 20 standalone app, zoneless, `provideFileRouter()`, ~15 page
files, `analog()` in `vite.config.ts`, `pnpm run build` with prerender
routes configured. Compare the prerendered HTML for any content route
against the hydrated DOM: the HTML contains only the shell.

## Environment

- `@analogjs/platform` 1.22.5, `@analogjs/vite-plugin-angular` 1.22.5
- `@angular/*` 20.x, zoneless (`provideZonelessChangeDetection`)
- Vite 6.4.3, pnpm workspace with `pnpm-workspace.yaml` overrides
- Bootstrap forwards the Angular 20 `BootstrapContext`:
  `(context) => bootstrapApplication(App, config, context)`
