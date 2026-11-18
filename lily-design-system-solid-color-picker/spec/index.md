# ColorPicker — Specification

The Solid colour-picker helper, `@lilydesignsystem/solid-color-picker`, a port of the canonical Svelte package
(`../lily-design-system-svelte-color-picker/`). The markup contract and rules are the Svelte package's; where they disagree,
Svelte wins.

## 1. Summary

A colour picker in four areas inside one labelled group: recent colours, a palette with a Transparent button, and entry fields
(hex, CSS name, and HSL, HSB, RGB and CMYK groups), with a separator between the areas. It holds a form value; it applies nothing to the
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
    hex field, name field (with a datalist of the 148 CSS names), and four fieldsets: HSL, HSB, RGB
    and CMYK, each a legend and its number fields
  </div>
</div>
```

## 4. Rules

1. Every word comes from `labels`; nothing English ships.
2. A swatch's accessible name is `colorLabel(color)`, else its CSS name, else its hex value; Transparent's is `labels.transparent`.
3. Choosing a colour sets `value`, puts it first in `recent` (no repeats, at most `maxRecent`) and calls `onchange` once.
   Choosing the current value again does nothing.
4. Swatches are native radios: Left and Right move and choose; in the palette, Up and Down move by `columns`, at the edges they
   stay.
5. The hex and name fields apply on change (Enter or leaving the field). A non-empty entry that is not a colour sets
   `aria-invalid="true"`, and with `labels.invalid` a message linked by `aria-describedby`; the value does not change.
6. The entry area has four colour-model groups, each a `fieldset` named by its `legend`: HSL (hue 0 to 360, saturation and
   lightness 0 to 100), HSB (hue, saturation and brightness), RGB (0 to 255) and CMYK (0 to 100; the simple formula from RGB,
   not a print conversion). Every field shows the current value and applies on change; a field's name is read with its group's.
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
- [x] HSL, HSB, RGB and CMYK groups (rule 6).
- [x] Hidden form input, disabled, rest props and class (rules 8 and 9).
- [ ] A composed example page and its e2e and axe checks.
- [ ] Screen-reader sessions.

## 6. Port notes

- `value` / `defaultValue` / `onChange` and `recent` / `defaultRecent` / `onRecentChange` replace Svelte's bindable `value` and `recent`, controlled or uncontrolled.
- `class` replaces `class`.
- The entry fields apply on the native `change` event, as in Svelte; Solid's `onChange` fires on every keystroke and would choose each partial number.

## 7. Tests

`ColorPicker.test.tsx` (16) and `colors.test.ts` (8), one or more per rule, with form reset and controlled use.

---

Lily™ and Lily Design System™ are trademarks.
