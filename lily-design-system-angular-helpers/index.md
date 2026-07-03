# Lily Design System — Angular Helpers

A catalog of opinionated, reusable Angular 20 helper components that
sit alongside the headless
[`lily-design-system-angular-headless`](../lily-design-system-angular-headless/)
library. Where the headless library ships pure markup primitives,
these helpers wrap a complete lifecycle (selection + persistence +
DOM application) for one small, common job.

## Catalog

| Helper                                                                                    | Purpose                                                         |
| ----------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| [`lily-design-system-angular-theme-select`](./lily-design-system-angular-theme-select/)   | Pick a visual theme; dynamic CSS load + `data-theme` swap.      |
| [`lily-design-system-angular-locale-select`](./lily-design-system-angular-locale-select/) | Pick a BCP 47 locale; sets `lang` + `dir` on the document root. |
| [`lily-design-system-angular-text-size-select`](./lily-design-system-angular-text-size-select/) | Pick a text size; sets `data-text-size` on the document root.   |

## Conventions

Every helper subproject follows the same shape:

```
lily-design-system-angular-<name>/
├── spec/index.md                          ← single source of truth (SDD)
├── AGENTS.md                        ← AI-agent metadata pointer
├── AGENTS/                          ← topic-by-topic agent files
│   ├── api.md
│   ├── lifecycle.md
│   ├── accessibility.md
│   ├── testing.md
│   └── ssr.md
├── CLAUDE.md                        ← loads AGENTS.md
├── index.md                         ← comprehensive user guide
├── index.ts                         ← barrel re-export
├── {kebab-name}.component.ts        ← the standalone component
├── {kebab-name}.component.spec.ts   ← vitest spec (one test per §7 acceptance)
├── CHANGELOG.md
├── docs/                            ← topic-by-topic deep-dives
└── examples/                        ← runnable Angular component files
```

The catalog parent shares its own `AGENTS/` and `AGENTS/shared/`
directories with conventions, testing, accessibility, and SSR rules,
plus the Lily-wide headless / i18n / theme principles ported from
the root canonical AGENTS files.

Shared design decisions across the catalog:

- **Angular 20** standalone components with signal-based inputs
  (`input<T>()`, `input.required<T>()`), signal outputs
  (`output<T>()`), and model signals (`model<string>()`) for two-way
  binding.
- **`OnPush`** change detection on every component.
- **`@for` control flow** (not `*ngFor`).
- **Template-inline only.** Each component declares its template via
  the `template:` field; no `templateUrl`, no `styles`, no
  `styleUrls`.
- **TypeScript** strict on the public surface; types exported from
  `index.ts`.
- **Headless**: no bundled CSS, fonts, icons, or images. Consumer
  styles every visual aspect via a kebab-case class hook.
- **SSR-safe**: no DOM writes outside the browser; all DOM
  side-effects happen via `effect()` and check for `document`.
- **i18n-clean**: every user-facing string comes from an input.
- **One job per helper**: each helper owns the entire lifecycle of
  one user-preference dimension (theme, language, etc.) and composes
  cleanly with the others.
- **Spec-driven**: every helper has a `spec/index.md` numbered with §
  references; tests assert against those numbers; docs link back.
- **Template-cast pattern**: when reading event-target values in a
  template expression, use `$any($event.target).value` (NOT
  `($event.target as HTMLInputElement).value`). Angular's template
  parser rejects parenthesised TS casts inside method calls, as
  documented in the angular-headless README.

## Differences from the headless library

The headless library mirrors the canonical 490-component catalog.
Each component is a pure container with no lifecycle. A consumer
typing on top of `ThemeSelect` from
`lily-design-system-angular-headless` writes their own select markup,
their own persistence, and their own loading.

The helpers in this directory are higher-level: they own the
lifecycle, they own the dynamic loading or attribute application, and
they expose a smaller, more opinionated API. Both layers can coexist
in one app; the helpers are not a replacement.

## Angular idioms used throughout

The helpers commit to a small set of Angular 20 features:

- **Standalone components** — every helper declares `standalone:
  true` (the Angular 20 default) so consumers add them via the
  `imports` array on their own standalone component, not via an
  NgModule.
- **Signal inputs** — `input<T>()` and `input.required<T>()` for
  typed reactive props; never the legacy `@Input()` decorator. Signal
  inputs are read by calling them (`label()`, `themes()`).
- **Signal outputs** — `output<T>()` returns an `OutputEmitterRef`;
  consumers subscribe via the template `(themeChange)="..."` syntax
  or via `.subscribe(...)` from TypeScript.
- **Model signals** — `model<string>()` gives a two-way bindable
  signal used as `[(value)]="x"` on the template side. The internal
  surface combines `value()` (read) and `value.set(next)` (write).
- **`OnPush` change detection** — every component sets
  `changeDetection: ChangeDetectionStrategy.OnPush`. Signals power
  the reactivity; manual `markForCheck` calls are unnecessary.
- **`@for` control flow** — the new built-in flow syntax. `*ngFor`
  is not used; neither is `*ngIf` (the helpers use `@if` where
  needed).
- **`effect()`** — the only reactive primitive used for DOM
  side-effects. `effect()` is scheduled on the browser tick, runs
  inside a writable change-detection context, and reads tracked
  signals.
- **`$any($event.target).value`** — the canonical template-cast
  pattern. Angular's template parser rejects parenthesised TS casts
  (`($event.target as HTMLInputElement).value`) inside method calls,
  so the `$any()` form is required.

These choices map 1:1 to the Svelte canonical helpers so behaviour
and tests stay in lock-step across frameworks.

## Sibling helper catalogs

- [`lily-design-system-svelte-helpers`](../lily-design-system-svelte-helpers/)
  — the canonical Svelte 5 reference implementation. When the
  Angular port and the Svelte canonical disagree, the Svelte side
  wins and the Angular side is patched.
- [`lily-design-system-vue-helpers`](../lily-design-system-vue-helpers/)
  — Vue 3 port of the same contract; useful as a cross-framework
  reference because its template DSL is closest to Angular's.

## Testing

Each helper ships a vitest suite that runs under jsdom +
`@angular/core/testing` `TestBed`. The acceptance criteria are
listed in each `spec/index.md` §7 and the test file matches one
`it(...)` per numbered item, named with the section number for fast
cross-referencing.

```bash
cd lily-design-system-angular-theme-select
pnpm test
```

The shared rules around test setup (jsdom, `TestBed.configureTestingModule`,
`fixture.detectChanges()`, signal getters) live in
[`AGENTS/testing.md`](./AGENTS/testing.md).

## License

Each helper is dual-licensed under MIT or Apache-2.0 or GPL-2.0 or
GPL-3.0 or BSD-3-Clause. Contact joel@joelparkerhenderson.com for
other terms.
