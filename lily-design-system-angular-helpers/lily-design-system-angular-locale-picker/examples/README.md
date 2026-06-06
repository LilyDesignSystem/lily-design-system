# Examples

Self-contained Angular 20 examples for
`lily-design-system-angular-locale-picker`. Each file is a runnable
standalone component that can be dropped into any Angular 20 host
(Analog page, Angular CLI route, Storybook story).

Every example assumes:

- Angular 20 with standalone components and signal inputs.
- No CSS dependency — the picker is headless. Consumers style the
  `locale-picker`, `locale-picker-option`, `locale-picker-list`,
  `locale-picker-select`, and `locale-picker-option-label` class
  hooks.

| #  | File                                                          | Demonstrates                                                       |
|----|---------------------------------------------------------------|--------------------------------------------------------------------|
| 1  | [`01-radios.component.ts`](./01-radios.component.ts)          | Default `<fieldset role="radiogroup">` rendering.                  |
| 2  | [`02-select.component.ts`](./02-select.component.ts)          | Sibling `<select>` bound to the same `[(value)]` signal.           |
| 3  | [`03-buttons.component.ts`](./03-buttons.component.ts)        | Toggle-button group with short codes / glyphs and `aria-pressed`.  |
| 4  | [`04-rtl-demo.component.ts`](./04-rtl-demo.component.ts)      | Live RTL preview — Arabic, Hebrew, Persian, Urdu, Pashto.          |
| 5  | [`05-nhs-style.component.ts`](./05-nhs-style.component.ts)    | NHS UK-style language banner with endonyms and a `className` hook. |
| 6  | [`06-with-transloco.component.ts`](./06-with-transloco.component.ts) | Binding to Transloco's `setActiveLang()`.                  |
| 7  | [`07-with-ngx-translate.component.ts`](./07-with-ngx-translate.component.ts) | Driving `TranslateService.use()` from `(localeChange)`. |
| 8  | [`08-ssr-cookie.component.ts`](./08-ssr-cookie.component.ts)  | Analog v1 cookie-based SSR — no flash of default locale.           |
| 9  | [`09-scoped-target.component.ts`](./09-scoped-target.component.ts) | Multiple per-region pickers, each scoped to its own panel.    |
| 10 | [`10-combobox.component.ts`](./10-combobox.component.ts)      | Native `<datalist>` type-ahead for all 436 built-in locales.       |

## Running the examples

These files are illustrations, not a build. The fastest way to try
one is:

1. Inside any Angular CLI project (or Analog), drop the example
   into a route component or a Storybook story.
2. Import the `LocalePicker` from this directory (or via the
   `index.ts` barrel).
3. `ng serve` (or `pnpm dev`) and visit the route.

## `[(value)]` conventions

The picker exposes its bindable on `value` (Angular 17+ `model()`
signal). Always use `[(value)]="locale"` in templates, and pair
with `(localeChange)` for one-shot side effects (cookie writes,
imperative i18n-library calls, analytics).

The consumer-side field must be a `WritableSignal<string>`
(declared via `signal("")`), not a plain string.

## Naming

Angular templates use camelCase for input bindings:
`detectFromNavigator`, `localeLabels`, `applyDir`, `storageKey`.
The signal getters in TypeScript (`label()`, `locales()`, etc.)
are the canonical reads.

## Why `.ts` files instead of `.html` + `.ts` pairs?

The catalog uses template-inline only — no `templateUrl`, no
`styles`, no `styleUrls`. Each example is a single `.ts` file
with the template in the `template:` field of the `@Component`
decorator. This matches the Angular 20 convention used throughout
the angular-headless library.

## Slot-args contract (for sibling widgets)

Because v0.1.0 doesn't yet expose `ng-content` projection inside
the `<fieldset>`, the recommended pattern is a sibling widget
bound to the same `[(value)]` signal. The picker still owns:

- `lang` / `dir` writes to the target
- `localStorage` persistence (if `storageKey` is set)
- `navigator.languages` detection (if `detectFromNavigator=true`)
- `localeChange` emission

The sibling widget owns:

- The custom markup (button group, `<select>`, combobox).
- The click → `signal.set(...)` plumbing.

This split lets the picker stay headless while consumers pick any
UI affordance.

## See also

- [`../docs/concepts.md`](../docs/concepts.md) — mental model and
  lifecycle diagram.
- [`../docs/ssr.md`](../docs/ssr.md) — full SSR / Analog / Angular
  CLI recipe.
- [`../docs/rtl.md`](../docs/rtl.md) — what `dir="rtl"` actually
  changes and CSS tips.
- [`../docs/i18n-integration.md`](../docs/i18n-integration.md) —
  wiring @angular/localize, Transloco, ngx-translate, raw `Intl.*`.
- [`../spec.md`](../spec.md) — the canonical contract.
