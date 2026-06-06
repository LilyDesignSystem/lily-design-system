# Examples

Self-contained Angular 20 examples for
`lily-design-system-angular-theme-picker`. Each file is a runnable
standalone component that can be dropped into any Angular 20 host
(Analog page, Angular CLI route, Storybook story).

Every example assumes:

- A directory of theme CSS files served at `/assets/themes/`
  (typically `src/assets/themes/light.css`,
  `src/assets/themes/dark.css`, …). The
  [Lily themes](../../../themes/) catalog ships 41 ready-to-use
  themes.
- Each theme CSS file scopes its tokens with
  `:root[data-theme="<slug>"]`.

| # | File                                                          | Demonstrates                              |
|---|---------------------------------------------------------------|-------------------------------------------|
| 1 | [`basic.component.ts`](./basic.component.ts)                  | Minimal three-theme picker.               |
| 2 | [`two-way-binding.component.ts`](./two-way-binding.component.ts) | `[(value)]` and `(themeChange)`.       |
| 3 | [`persistence.component.ts`](./persistence.component.ts)      | `localStorage` survival across reloads.   |
| 4 | [`custom-labels.component.ts`](./custom-labels.component.ts)  | `themeLabels` for i18n / display names.   |
| 5 | [`custom-rendering.component.ts`](./custom-rendering.component.ts) | v0.1.0 sibling-button workaround.    |
| 6 | [`preloaded.component.ts`](./preloaded.component.ts)          | Zero-flicker switching via preloading.    |
| 7 | [`multiple-pickers.component.ts`](./multiple-pickers.component.ts) | Two pickers in one page via `name`.   |
| 8 | [`system-preference.component.ts`](./system-preference.component.ts) | Follow `prefers-color-scheme`.      |
| 9 | [`lily-themes.component.ts`](./lily-themes.component.ts)      | All 41 Lily / DaisyUI themes at once.     |
| 10 | [`analog-cookie/`](./analog-cookie/)                         | SSR-resolved theme via a cookie (Analog). |

## Running the examples

These files are illustrations, not a build. The fastest way to try
one is:

1. Inside any Angular CLI project (or Analog), drop the example
   into a route component or a Storybook story.
2. Copy a couple of theme CSS files from
   [`../../../themes/`](../../../themes/) into `src/assets/themes/`.
3. `ng serve` or `pnpm dev` and visit the route.

## `[(value)]` conventions

The picker exposes its bindable on `value`. Always use
`[(value)]="theme"` in templates, and pair with `(themeChange)`
for one-shot side effects.

The consumer-side field must be a `WritableSignal<string>`
(declared via `signal("")`), not a plain string:

```ts
theme = signal<string>("");
```

## Naming

Angular templates use camelCase for input bindings: `themesUrl`,
`defaultValue`, `themeLabels`, `storageKey`. The `className` input
mirrors the HTML attribute name even though it differs from the
DOM property name.

The signal getters in TypeScript (`label()`, `themes()`, etc.) are
the canonical reads; they map to the input names directly.

## Why `.ts` files instead of `.html` + `.ts` pairs?

The catalog uses template-inline only — no `templateUrl`, no
`styles`, no `styleUrls`. Each example is a single `.ts` file with
the template in the `template:` field of the `@Component` decorator.
This matches the Angular 20 convention used throughout the
angular-headless library.

## See also

- [`../docs/`](../docs/) — topic guides (props reference,
  accessibility, SSR, preloading, custom rendering, recipes,
  troubleshooting, styling).
- [`../spec.md`](../spec.md) — the canonical contract.
