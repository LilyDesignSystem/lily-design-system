# Lily Design System™: Vue color picker

`@lilydesignsystem/vue-color-picker` is a Vue colour picker in four areas:

1. **Recent colours**: a row of up to ten swatches, the newest first.
2. A separator.
3. **Palette**: 8 rows of 10 swatches, and a large **Transparent** button.
4. A separator.
5. **Entry fields**: a colour by hex, by CSS colour name (the X11 names, offered from a list), and by four colour models, each
   a group of number fields: HSL (hue, saturation, lightness), HSB (hue, saturation, brightness), RGB (red, green, blue) and
   CMYK (cyan, magenta, yellow, key).

It is headless: no CSS. Every swatch is a native radio carrying `data-color` and a `--color-picker-swatch` custom property, so
your CSS paints it. It holds a form value, as `date-time-picker` does: it applies nothing to the page and stores nothing. Use
`v-model:recent` to keep the recent colours.

## Install

```sh
npm install @lilydesignsystem/vue-color-picker
```

## Usage

```vue
<script setup lang="ts">
import { ref } from "vue";
import { ColorPicker } from "@lilydesignsystem/vue-color-picker";

const labels = {
  picker: "Text colour",
  recent: "Recent colours",
  palette: "Colours",
  transparent: "Transparent",
  custom: "Custom colour",
  hex: "Hex",
  name: "Colour name",
  hue: "Hue",
  saturation: "Saturation",
  lightness: "Lightness",
  brightness: "Brightness",
  hsl: "HSL",
  hsb: "HSB",
  rgb: "RGB",
  cmyk: "CMYK",
  red: "Red",
  green: "Green",
  blue: "Blue",
  cyan: "Cyan",
  magenta: "Magenta",
  yellow: "Yellow",
  key: "Black",
  invalid: "Not a colour",
};
const colour = ref("#005eb8");
const recent = ref<string[]>([]);
</script>

<template>
  <ColorPicker
    v-model="colour"
    v-model:recent="recent"
    :labels="labels"
    name="colour"
  />
</template>
```

## Props

| Prop         | Type                          | Default            | What it does                                                                            |
| ------------ | ----------------------------- | ------------------ | --------------------------------------------------------------------------------------- |
| `labels`     | `Labels`                      | required           | Every word: the group, the two radio groups, Transparent, the fields. No English ships. |
| `modelValue` | `string` (`v-model`)          | `""`               | `"#rrggbb"`, `"transparent"`, or `""` for none.                                         |
| `recent`     | `string[]` (`v-model:recent`) | `[]`               | Recent choices, newest first.                                                           |
| `maxRecent`  | `number`                      | `10`               | How many recent colours to keep.                                                        |
| `palette`    | `string[]`                    | `defaultPalette()` | The palette, row by row. Pass your organisation's colours here.                         |
| `columns`    | `number`                      | `10`               | Swatches per row; ArrowUp and ArrowDown move by this many.                              |
| `colorLabel` | `(color: string) => string`   | CSS name, else hex | Each swatch's accessible name. Pass one to name your colours in the reader's language.  |
| `name`       | `string`                      | none               | Renders a hidden input, so the colour submits with a form.                              |
| `disabled`   | `boolean`                     | `false`            | Disables every control.                                                                 |

Events: `update:modelValue` and `change` (once for each new choice), `update:recent`. `class` and other attributes fall
through to the root.

`Labels` has, all required, `picker`, `recent`, `palette`, `transparent`, `custom`, `hex` and `name`; the four group names
`hsl`, `hsb`, `rgb` and `cmyk`; and the field names `hue`, `saturation`, `lightness`, `brightness`, `red`, `green`, `blue`,
`cyan`, `magenta`, `yellow` and `key`. `invalid` (optional) is the message beside a hex or name
field that holds no colour).

## Keyboard

- **Tab** moves between the recent colours, the palette, Transparent and each field.
- In the palette and the recent row, **Left** and **Right** move one swatch and choose it (the browser's radio keys).
- In the palette, **Up** and **Down** move one row.
- **Space** chooses the focused swatch; **Enter** or **Space** presses Transparent.
- In the hex and name fields, **Enter** (or leaving the field) applies what you typed.

## Styling

```css
.color-picker-swatch {
  appearance: none;
  inline-size: 1.75rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--color-picker-swatch);
}
.color-picker-swatch:checked {
  box-shadow:
    0 0 0 2px Canvas,
    0 0 0 4px CanvasText;
}
.color-picker-palette-row {
  display: flex;
  gap: 0.25rem;
}
```

Class hooks: `color-picker`, `color-picker-recent`, `color-picker-separator`, `color-picker-palette`,
`color-picker-palette-row`, `color-picker-swatch`, `color-picker-transparent`, `color-picker-transparent-icon`,
`color-picker-custom`, `color-picker-field` (with `-hex`, `-name`, `-hsl`, `-hsb`, `-rgb`, `-cmyk`), `color-picker-hex`, `color-picker-name`,
`color-picker-hsl`, `color-picker-hsb`, `color-picker-rgb`, `color-picker-cmyk` (each field also `-{key}`, such as
`color-picker-cmyk-k`), `color-picker-invalid`. The root carries `data-value`.

## The colour functions

The package also exports its colour model: `parseColor` (hex, CSS name, `rgb()`, `hsl()` or `transparent`), `normalizeHex`,
`hexToRgb`, `rgbToHex`, `rgbToHsl`, `hslToRgb`, `hexToHsl`, `hslToHex`, `rgbToHsb`, `hsbToRgb`, `hexToHsb`, `hsbToHex`,
`rgbToCmyk`, `cmykToRgb`, `hexToCmyk`, `cmykToHex`, `nameOfColor`, `pushRecent`, `defaultPalette` and
`CSS_NAMED_COLORS` (the 148 CSS names).

## Accessibility

- The whole control is one group named by `labels.picker`; the recent row and the palette are radio groups, so a screen reader
  says, for example, "tomato, radio, 3 of 80".
- A swatch is never colour alone: each has a name, from `colorLabel`, its CSS name, or its hex value.
- The default names are CSS keywords or hex values. For people who do not read English colour words, pass `colorLabel`.
- See [docs/accessibility.md](docs/accessibility.md).

## Not included

- A two-dimensional hue and saturation board, an eyedropper, or alpha. Use the fields for an exact colour.
- Print colour management. CMYK here is the simple formula from RGB, not a conversion through a printer's colour profile.
- Storage: bind `recent` and keep it where your app keeps preferences.

## Differences from the Svelte package

- `v-model` (`modelValue`) and `v-model:recent` replace Svelte's bindable `value` and `recent`; `change` replaces `onchange`.
- `class` and other attributes fall through to the root, Vue's equivalent of rest props.

The Svelte package (`../lily-design-system-svelte-color-picker/`) is canonical; where they disagree, Svelte wins.

---

Lily™ and Lily Design System™ are trademarks.
