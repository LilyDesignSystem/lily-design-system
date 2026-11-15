# ColorPicker — Specification

The Svelte colour-picker helper, `@lilydesignsystem/svelte-color-picker`. Svelte is the first and, so far, only catalog.

## 1. Summary

A colour picker in four areas inside one labelled group: recent colours, a palette with a Transparent button, and entry fields
(hex, CSS name, HSL, optionally RGB), with a separator between the areas. It holds a form value; it applies nothing to the
document and persists nothing.

## 2. Scope

- In: choosing a colour from recent picks or a palette, entering one exactly, Transparent, form submission and reset.
- Out: a two-dimensional hue and saturation board, an eyedropper, alpha, persistence, named colours in languages other than the
  consumer's `colorLabel`.

## 3. Markup contract

```html
<div
  class="color-picker {class}"
  role="group"
  aria-label="{labels.picker}"
  data-value="{value}"
>
  <input
    type="hidden"
    name="{name}"
    value="{value}"
  />
  <!-- only with name -->
  <fieldset
    class="color-picker-recent"
    role="radiogroup"
    aria-label="{labels.recent}"
  >
    <input
      class="color-picker-swatch"
      type="radio"
      name="{id}-recent"
      value="#rrggbb"
      aria-label="…"
      data-color="#rrggbb"
      style="--color-picker-swatch: #rrggbb"
    />
    <!-- ≤ maxRecent -->
  </fieldset>
  <hr class="color-picker-separator" />
  <fieldset
    class="color-picker-palette"
    role="radiogroup"
    aria-label="{labels.palette}"
  >
    <div class="color-picker-palette-row">…{columns} swatches…</div>
    <!-- one per row -->
  </fieldset>
  <button
    class="color-picker-transparent"
    type="button"
    aria-pressed="…"
  >
    <svg
      class="color-picker-transparent-icon"
      aria-hidden="true"
      …
    ></svg
    >{labels.transparent}
  </button>
  <hr class="color-picker-separator" />
  <div
    class="color-picker-custom"
    role="group"
    aria-label="{labels.custom}"
  >
    hex field, name field (with a datalist of the 148 CSS names), H/S/L number fields, R/G/B number
    fields (when labelled)
  </div>
</div>
```

## 4. Rules

1. Every word comes from `labels`; nothing English ships. RGB fields render only when `red`, `green` and `blue` are all given.
2. A swatch's accessible name is `colorLabel(color)`, else its CSS name, else its hex value; Transparent's is `labels.transparent`.
3. Choosing a colour sets `value`, puts it first in `recent` (no repeats, at most `maxRecent`) and calls `onchange` once.
   Choosing the current value again does nothing.
4. Swatches are native radios: Left and Right move and choose; in the palette, Up and Down move by `columns`, at the edges they
   stay.
5. The hex and name fields apply on change (Enter or leaving the field). A non-empty entry that is not a colour sets
   `aria-invalid="true"`, and with `labels.invalid` a message linked by `aria-describedby`; the value does not change.
6. The HSL and RGB fields show the current value and apply on change.
7. `value` is `"#rrggbb"` (lowercase), `"transparent"` or `""`.
8. A form reset restores the starting value.
9. `disabled` disables every control.
10. Headless: no CSS; the Transparent icon is the one bundled asset, decorative and `aria-hidden`, on the shared icon grid.

## 5. Acceptance criteria

- [x] Four areas and two separators in one named group (rule 1).
- [x] An 8 by 10 default palette of distinct colours, greys first (`defaultPalette`).
- [x] Swatch names (rule 2).
- [x] Choice, recent and onchange (rule 3).
- [x] Row keys (rule 4).
- [x] Hex and name entry, with invalid entries marked (rule 5).
- [x] HSL and RGB fields (rule 6).
- [x] Hidden form input, disabled, rest props and class (rules 8 and 9).
- [ ] Ports to the other seven catalogs.
- [ ] A composed example page and its e2e and axe checks.
- [ ] Screen-reader sessions.

## 6. Tests

`ColorPicker.test.ts` (14) and `colors.test.ts` (7), one or more per rule.

---

Lily™ and Lily Design System™ are trademarks.
