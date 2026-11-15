# Lily Design System™: Web Components color picker

`@lilydesignsystem/web-components-color-picker` is a Web Components colour picker in four areas:

1. **Recent colours**: a row of up to ten swatches, the newest first.
2. A separator.
3. **Palette**: 8 rows of 10 swatches, and a large **Transparent** button.
4. A separator.
5. **Entry fields**: a colour by hex, by CSS colour name (the X11 names, offered from a list), and by four colour models, each
   a group of number fields: HSL (hue, saturation, lightness), HSB (hue, saturation, brightness), RGB (red, green, blue) and
   CMYK (cyan, magenta, yellow, key).

It is headless: no CSS. Every swatch is a native radio carrying `data-color` and a `--color-picker-swatch` custom property, so
your CSS paints it. It holds a form value, as `date-time-picker` does: it applies nothing to the page and stores nothing. Listen
for `recentchange` to keep the recent colours.

## Install

```sh
npm install @lilydesignsystem/web-components-color-picker
```

## Usage

```html
<form>
  <lily-color-picker
    name="colour"
    value="#005eb8"
  ></lily-color-picker>
</form>
<script type="module">
  import "@lilydesignsystem/web-components-color-picker";

  const picker = document.querySelector("lily-color-picker");
  picker.labels = {
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
  picker.addEventListener("valuechange", (event) => console.log(event.detail.value));
  picker.addEventListener("recentchange", (event) =>
    localStorage.setItem("recent", event.detail.recent.join(" ")),
  );
</script>
```

## Props

Importing the package registers `<lily-color-picker>`. It renders into its light DOM, so an enclosing form collects the hidden input.

| Attribute    | Property     | Type                         | Default            | What it does                                               |
| ------------ | ------------ | ---------------------------- | ------------------ | ---------------------------------------------------------- |
| `labels`     | `labels`     | JSON / `Labels`              | required           | Every word. No English ships.                              |
| `value`      | `value`      | `string`                     | `""`               | `"#rrggbb"`, `"transparent"`, or `""` for none.            |
| `recent`     | `recent`     | space-separated / `string[]` | `[]`               | Recent choices, newest first.                              |
| `max-recent` |              | `number`                     | `10`               | How many recent colours to keep.                           |
| `palette`    | `palette`    | space-separated / `string[]` | `defaultPalette()` | The palette, row by row.                                   |
| `columns`    |              | `number`                     | `10`               | Swatches per row; ArrowUp and ArrowDown move by this many. |
|              | `colorLabel` | `(color: string) => string`  | CSS name, else hex | Each swatch's accessible name, in the reader's language.   |
| `name`       |              | `string`                     | none               | Renders a hidden input, so the colour submits with a form. |
| `disabled`   |              | boolean                      | off                | Disables every control.                                    |
| `class`      |              | `string`                     | none               | Also added to the inner root's class list.                 |

Events (bubbling): `valuechange` (`detail: { value }`, once for each new choice and after a form reset that changes it) and
`recentchange` (`detail: { recent }`).

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

- Attributes and properties replace props: `labels` is JSON or an object, `recent` and `palette` are space-separated or arrays, and `colorLabel` is a property only.
- Events replace callbacks and binding: `valuechange` and `recentchange`.
- After choosing a recent swatch moves it to the front, focus is put back on it (moving a node drops its focus).
- An independent copy of `@lilydesignsystem/html-color-picker` with the `lily-` tag prefix of the Web Components catalog; keep the two in step (`bin/check-port-parity`).

The Svelte package (`../lily-design-system-svelte-color-picker/`) is canonical; where they disagree, Svelte wins.

---

Lily™ and Lily Design System™ are trademarks.
