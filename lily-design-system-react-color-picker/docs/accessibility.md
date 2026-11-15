# Accessibility — ColorPicker

- **Swatches are native radios.** The recent row and the palette are each a `fieldset` with `role="radiogroup"`, so a screen
  reader announces the group, the swatch's name and its position ("tomato, radio, 3 of 80"), and the browser supplies Left and
  Right, Space, form submission and reset. The one addition is Up and Down by a palette row, because the palette looks like a
  grid. It is not an ARIA grid: a grid would need its own roving focus and would lose the native radio behaviour.
- **Never colour alone (WCAG 1.4.1).** Every swatch has a name. The defaults are CSS keywords ("tomato") or hex values, which
  are exact but not friendly in every language; pass `colorLabel` to name colours in the reader's language.
- **Transparent is a button**, with `aria-pressed`, because it is not a colour swatch; its icon is decorative.
- **Typed entry is checked, not guessed.** A hex or name that is not a colour is marked `aria-invalid` and, with
  `labels.invalid`, explained by linked text; the value does not change.
- **Contrast is the consumer's.** A swatch's colour may be near the page colour; draw a border or ring (the reference themes'
  approach) so every swatch's edge meets 3:1 (WCAG 1.4.11), and show the checked swatch by more than colour.
- **Target size.** Swatches should be at least 24 by 24 CSS pixels (WCAG 2.5.8), 44 under a coarse pointer.
