# Examples

Self-contained Angular 20 examples for
`lily-design-system-angular-locale-chooser`. Each file is a runnable
standalone component that can be dropped into any Angular 20 host
(Analog page, Angular CLI route, Storybook story).

Every example assumes:

- Angular 20 with standalone components and signal inputs.
- No CSS dependency — the select is headless. Consumers style the
  `locale-chooser` (root), `locale-chooser-button`, `locale-chooser-icon`,
  `locale-chooser-list`, and `locale-chooser-option` hooks the component
  emits, plus the example-only `locale-chooser-status`,
  `locale-chooser-hidden`, `locale-button-group`,
  `locale-chooser-select`, and `locale-chooser-combobox-label` hooks.
- **The listbox needs positioning CSS and this package ships none.**
  The `<ul class="locale-chooser-list">` sits in normal document flow,
  so it pushes content down when opened unless you give it
  `position: absolute` inside a `position: relative` root. Use
  `inset-inline-start`, not `left`, so it follows `dir="rtl"`.
- `locale-chooser-hidden` (the `sibling-select`, `sibling-buttons`,
  `nhs-style`, and `combobox` examples) must resolve to
  `display: none`, **not** an `.sr-only` clip-path recipe. Those
  examples replace the helper's UI with their own affordance; leaving
  the helper's globe button exposed to assistive technology would give
  screen-reader and keyboard users a duplicate language control.

| #  | File                                                                   | Demonstrates                                                                          |
|----|------------------------------------------------------------------------|---------------------------------------------------------------------------------------|
| 1  | [`basic.component.ts`](./basic.component.ts)                           | Default icon-button + APG listbox rendering, with the status region.                  |
| 2  | [`sibling-select.component.ts`](./sibling-select.component.ts)         | Sibling native `<select>` bound to the same `[(value)]` signal for long locale lists. |
| 3  | [`sibling-buttons.component.ts`](./sibling-buttons.component.ts)       | Toggle-button group with short codes / glyphs and `aria-pressed`.                     |
| 4  | [`rtl-demo.component.ts`](./rtl-demo.component.ts)                     | Live RTL preview — Arabic, Hebrew, Persian, Urdu, Pashto.                             |
| 5  | [`nhs-style.component.ts`](./nhs-style.component.ts)                   | NHS UK-style language banner with endonyms and a `className` hook.                    |
| 6  | [`with-transloco.component.ts`](./with-transloco.component.ts)         | Binding to Transloco's `setActiveLang()`.                                             |
| 7  | [`with-ngx-translate.component.ts`](./with-ngx-translate.component.ts) | Driving `TranslateService.use()` from `(localeChange)`.                               |
| 8  | [`analog-cookie.component.ts`](./analog-cookie.component.ts)           | Analog v1 cookie-based SSR — no flash of default locale.                              |
| 9  | [`scoped-target.component.ts`](./scoped-target.component.ts)           | Multiple per-region selects, each scoped to its own panel.                            |
| 10 | [`combobox.component.ts`](./combobox.component.ts)                     | Native `<datalist>` type-ahead for all 436 built-in locales.                          |

## Running the examples

These files are illustrations, not a build. The fastest way to try
one is:

1. Inside any Angular CLI project (or Analog), drop the example
   into a route component or a Storybook story.
2. Import the `LocaleChooser` from this directory (or via the
   `index.ts` barrel).
3. `ng serve` (or `pnpm dev`) and visit the route.

## `[(value)]` conventions

The select exposes its bindable on `value` (Angular 17+ `model()`
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

## Replacing the button glyph

Project an `<ng-template>` into `<lily-locale-chooser>` to replace the
default globe glyph. It receives the `ChildArgs` context —
`{ $implicit, value, open, labelFor }` — and can be typed with the
optional `LocaleChooserIcon` marker directive:

```html
<lily-locale-chooser label="Language" [locales]="locales" [(value)]="locale">
    <ng-template lilyLocaleChooserIcon let-args>
        {{ args.labelFor(args.value) }}
    </ng-template>
</lily-locale-chooser>
```

The template replaces the **glyph only**. It never renders options —
the listbox is component-owned.

## Sibling-widget contract (for a different affordance)

To replace the whole affordance rather than just the glyph — a button
group, a native `<select>`, a filtering combobox — hide the helper and
bind a sibling widget to the same `[(value)]` signal. The helper still
owns:

- `lang` / `dir` writes to the target
- `localStorage` persistence (if `storageKey` is set)
- `navigator.languages` detection (if `detectFromNavigator=true`)
- `localeChange` emission

The sibling widget owns:

- The custom markup (button group, `<select>`, combobox).
- The click → `signal.set(...)` plumbing.
- Its own accessible naming and keyboard behaviour.

This split lets the select stay headless while consumers pick any
UI affordance. The `sibling-select`, `sibling-buttons`, `nhs-style`,
and `combobox` examples all use it.

## See also

- [`../docs/concepts.md`](../docs/concepts.md) — mental model and
  lifecycle diagram.
- [`../docs/ssr.md`](../docs/ssr.md) — full SSR / Analog / Angular
  CLI recipe.
- [`../docs/rtl.md`](../docs/rtl.md) — what `dir="rtl"` actually
  changes and CSS tips.
- [`../docs/i18n-integration.md`](../docs/i18n-integration.md) —
  wiring @angular/localize, Transloco, ngx-translate, raw `Intl.*`.
- [`../spec/index.md`](../spec/index.md) — the canonical contract.
