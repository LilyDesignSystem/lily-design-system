# Examples — TextSizePicker

Self-contained Angular 20 examples for
`lily-design-system-angular-text-size-picker`. Each file is a runnable
standalone component that can be dropped into any Angular 20 host
(Analog page, Angular CLI route, Storybook story).

| #   | File                                                             | Demonstrates                                                          |
| --- | ----------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 1   | [`basic.component.ts`](./basic.component.ts)                     | Minimal four-size picker plus the status region.                     |
| 2   | [`two-way-binding.component.ts`](./two-way-binding.component.ts) | `[(value)]` and `(sizeChange)`.                                       |
| 3   | [`persistence.component.ts`](./persistence.component.ts)         | `localStorage` survival across reloads.                              |
| 4   | [`custom-labels.component.ts`](./custom-labels.component.ts)     | `sizeLabels` for i18n / display names.                                |
| 5   | [`custom-rendering.component.ts`](./custom-rendering.component.ts) | `<ng-template>` button-glyph override.                              |
| 6   | [`external-buttons.component.ts`](./external-buttons.component.ts) | Driving the picker from your own UI via `[(value)]` and `sizeName`. |
| 7   | [`multiple-pickers.component.ts`](./multiple-pickers.component.ts) | Two pickers in one page via `name` and `target`.                    |

Every example assumes:

- Your stylesheet maps each `[data-text-size="<slug>"]` on the target
  element to a relative font size. Without that mapping the control
  works but nothing visibly resizes — see
  [`../docs/accessibility.md`](../docs/accessibility.md) for the
  recipe.
- **Some CSS of your own.** The control is an icon button that opens a
  listbox, and the package ships zero CSS — including no positioning
  for the list. Without `position: relative` on `.text-size-picker`
  and `position: absolute` on `.text-size-picker-list`, opening the
  list pushes page content around.

## What is deliberately missing

There is no `system-preference.component.ts` here, unlike the
`theme-picker` and `locale-picker` example sets. Browsers expose no
"preferred text size" signal — there is no media query equivalent to
`prefers-color-scheme` and no `navigator.languages` analogue — so the
component ships no `detectFromSystem` input to demonstrate. Users who
scale text at the OS level are already served by browser zoom and the
browser's own minimum-font-size setting, which this helper must not
fight.

## Running the examples

These files are illustrations, not a build. The fastest way to try
one is:

1. Inside any Angular CLI project (or Analog), drop the example into
   a route component or a Storybook story.
2. Add the slug → font-size mapping from
   [`../docs/accessibility.md`](../docs/accessibility.md) to your site
   stylesheet.
3. `ng serve` or `pnpm dev` and visit the route.

## `[(value)]` conventions

The picker exposes its bindable on `value`. Always use
`[(value)]="size"` in templates, and pair with `(sizeChange)` for
one-shot side effects.

The consumer-side field must be a `WritableSignal<string>` (declared
via `signal("")`), not a plain string:

```ts
size = signal<string>("");
```

## Naming

Angular templates use camelCase for input bindings: `defaultValue`,
`sizeLabels`, `storageKey`, `className`. The `className` input mirrors
the HTML attribute name even though it differs from the DOM property
name.

The signal getters in TypeScript (`label()`, `sizes()`, etc.) are the
canonical reads; they map to the input names directly.

## Why `.ts` files instead of `.html` + `.ts` pairs?

The catalog uses template-inline only — no `templateUrl`, no `styles`,
no `styleUrls`. Each example is a single `.ts` file with the template
in the `template:` field of the `@Component` decorator. This matches
the Angular 20 convention used throughout the angular-headless
library.

## See also

- [`../docs/accessibility.md`](../docs/accessibility.md) — what the
  control does well, and what it costs.
- [`../spec/index.md`](../spec/index.md) — the canonical contract.

---

Lily™ and Lily Design System™ are trademarks.
