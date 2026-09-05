---
name: lily-design-system-angular-helpers-skill
description: Use when someone asks how to install or import Lily Design System's Angular picker helpers (theme-picker, locale-picker, text-size-picker, motion-picker, share-picker, date-time-picker), wants the Angular-specific usage idiom (standalone components, signal inputs/model, `$any($event.target).value` template casts), or needs to know how the six helpers differ from plain Angular headless catalog components.
license: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause
---

# Lily Design System™ — Angular helpers usage

`lily-design-system-angular-helpers` is a catalog of six opinionated
Angular 20 components that sit alongside
[`lily-design-system-angular-headless`](../lily-design-system-angular-headless-skill/).
Where a headless catalog component is a pure markup primitive with no
lifecycle, each helper owns one complete interaction end to end. Each
helper is its own npm package, named `lily-design-system-angular-<name>`:

```sh
pnpm add lily-design-system-angular-theme-picker
pnpm add lily-design-system-angular-locale-picker
pnpm add lily-design-system-angular-text-size-picker
pnpm add lily-design-system-angular-motion-picker
pnpm add lily-design-system-angular-share-picker
pnpm add lily-design-system-angular-date-time-picker
```

## The six helpers and their contracts

Most helpers own a **user preference** — selection + DOM application +
optional persistence. `share-picker` owns an **action** instead, and
`date-time-picker` owns a **form value**; neither applies anything to the
document nor persists anything.

| Helper | Applies | Persists |
| --- | --- | --- |
| `theme-picker` | Swaps a managed `<link>` stylesheet href and sets `data-theme` on the document root. | Optional `localStorage`. |
| `locale-picker` | Sets `lang` (BCP 47) and `dir` on the document root. No translation. | Optional `localStorage`; optional `navigator.language` first-visit fallback. |
| `text-size-picker` | Sets `data-text-size` on the document root; consumer CSS maps values to sizing. | Optional `localStorage`. |
| `motion-picker` | Sets `data-motion` on the document root. Initial value defers to `(prefers-reduced-motion: reduce)` **unconditionally**, not behind an opt-in flag. | Optional `localStorage`. |
| `share-picker` | Nothing — opens the native share sheet where available, else a disclosure of consumer-supplied destinations plus copy-to-clipboard. | None. |
| `date-time-picker` | Nothing — it holds a form value: a typeable text field plus an APG date-picker dialog trigger. | None. |

## Two markup shapes

- **The four preference helpers** (`theme-picker`, `locale-picker`,
  `text-size-picker`, `motion-picker`) share one shape: an icon button that
  opens a WAI-ARIA APG listbox. Root `<div class="{helper} {class}">`
  containing a hidden input for form participation, a
  `<button class="{helper}-button" aria-haspopup="listbox" aria-expanded
  aria-controls>` whose only content is an `aria-hidden` glyph span, and a
  `<ul class="{helper}-list" role="listbox" hidden>` of
  `<li role="option" aria-selected>` options.
- **`share-picker`** is a disclosure of real `<a>` links plus a copy
  `<button>`, not a listbox — its destinations are navigation, so
  `role="menuitem"` would strip middle-click and open-in-new-tab.
- **`date-time-picker`** pairs a typeable text field with its own icon
  button trigger, opening an APG date-picker dialog — the one helper that
  is a form control rather than a page-header control, so the "single
  glyph, smallest footprint" reasoning behind the other five's trigger
  shape doesn't apply to it.

## The Angular-specific idiom

All six helpers follow the same Angular conventions as
`lily-design-system-angular-headless`:

- **Standalone components**, no NgModules.
- **Signal-based inputs/outputs** — `input<T>()`, `input.required<T>()`,
  `output<T>()`, and `model<T>()` for two-way binding.
- **`OnPush`** change detection.
- **`@for` control flow** (not `*ngFor`).
- **Template-inline only** — each component's template lives in the
  `template:` field; no `templateUrl`, no `styles`.

One Angular-specific wrinkle worth knowing: reading an event-target value
inside a template expression uses **`$any($event.target).value`**, not the
`($event.target as HTMLInputElement).value` cast idiom common elsewhere —
Angular's template parser rejects parenthesised TypeScript casts inside
method calls.

```ts
@Component({
  standalone: true,
  imports: [ThemePicker],
  template: `<lily-theme-picker [themes]="themes" [(value)]="theme" />`,
})
export class Header {
  themes = ["light", "dark"];
  theme = "light";
}
```

## SSR safety and idempotent apply

Like every catalog, the Angular helpers are SSR-safe: DOM writes (setting
`data-theme`, swapping the stylesheet `<link>`, writing `localStorage`)
happen only inside the component's own effect lifecycle, guarded so they
never run outside the browser. Applying a preference is idempotent — an
already-applied value is a no-op, no repeated DOM write and no repeated
change callback — which matters in Angular because `effect()` re-runs on
every relevant signal change, and a non-idempotent apply that writes back
into the same signal it read would loop.

## When NOT this skill

- For the Angular headless component library itself (the full 491-component
  catalog, the element-selector and tag+attribute-selector conventions) —
  use `lily-design-system-angular-headless-skill` instead.
- For framework-agnostic Lily concepts, terminology, or the shared
  `*-picker` contract that applies across all seven catalogs — use
  `lily-design-system-skill`.
