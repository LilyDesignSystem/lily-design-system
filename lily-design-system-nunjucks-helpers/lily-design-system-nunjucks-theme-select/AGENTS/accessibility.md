# Accessibility — ThemeSelect (Nunjucks)

The select targets WCAG 2.2 AAA using a native HTML `<select>`. This
file is the Nunjucks-flavoured view; the canonical contract is in
[`../spec/index.md`](../spec/index.md) §6.

## Roles and properties

| Element        | Role / Property               | Source        |
| -------------- | ----------------------------- | ------------- |
| `<select>`     | implicit `role="combobox"`    | Browser       |
| `<select>`     | `aria-label="{label}"`        | `opts.label`  |
| `<select>`     | `name`                        | Macro         |
| `<option>`     | implicit `role="option"`      | Browser       |
| `<option>`     | selected state (implicit)     | Browser       |

The macro does not add ARIA where native semantics already cover
the need. There is no `aria-pressed`, no manual focus management —
the native `<select>` behaviour is exactly what assistive technology
expects.

## Keyboard contract

Provided entirely by the platform's native `<select>`:

| Key                | Action                                            |
| ------------------ | ------------------------------------------------- |
| `Tab`              | Move focus to the select (one stop).              |
| `Shift+Tab`        | Move focus away from the select.                  |
| `Arrow Down`       | Select the next option.                           |
| `Arrow Up`         | Select the previous option.                       |
| `Home` / `End`     | Select the first / last option.                   |
| Typeahead          | Type characters to jump to a matching option.     |
| `Enter` / `Space`  | Open the option list (platform-dependent).        |
| `Escape`           | Close the option list.                            |

The client.js never installs JS keyboard handlers; the native
`<select>` is the correct mechanism.

## State signals

The active state is exposed in two independent channels — no
colour-only meaning is required:

1. `data-theme="<slug>"` on the target element (default `<html>`).
2. The managed `<link rel="stylesheet" data-lily-theme-select="…">`
   in `document.head`.

The `<select>`'s own selected `<option>` is deliberately **not** a
channel: the placeholder is always the selected option and
`select.value` is snapped back to `""` after every apply. A
screen-reader user therefore cannot learn the active theme from the
control. The compensating `.theme-select-status` region
(`aria-live="polite"`, fed from `onChange`) is part of the default
pattern and ships in the examples — see
[`../docs/accessibility.md`](../docs/accessibility.md).

## Internationalisation

- `opts.label` is consumer-supplied; pass a translated string.
- `opts.themeLabels` entries are consumer-supplied; localise the
  values.
- The macro never emits hardcoded English (or any other natural
  language) strings, including the word "default".

## Visible focus

The macro and client.js do not set `outline: none` or otherwise
suppress focus styling. The consumer's CSS is responsible for the
visible focus ring. NHS-UK and Lily themes ship a high-contrast
focus outline that meets WCAG 2.4.13.

## Reduced motion

The helper performs no animation. Theme CSS files are responsible
for respecting `prefers-reduced-motion` if they introduce
transitions on the `data-theme` swap.

## Screen-reader smoke test

- VoiceOver (macOS) announces the control as "{label}, pop-up
  button" and each option as "{labelFor(slug)}, selected / not
  selected".
- NVDA announces "{label} combo box" and each option similarly.
- Selection changes are announced because the underlying control
  value changes.

## Common mistakes to avoid

- **Replacing the select with a div in the caller block.** The
  `{% call %}` block renders inside the select root; do not wrap a
  div *around* the macro invocation if you need the control
  semantics.
- **Hiding the `<select>` with `display: none`.** That removes it
  from the accessibility tree. Use a visually-hidden pattern
  (`clip-path: inset(50%)` or the `.sr-only` recipe) instead.
- **Forgetting to translate `opts.themeLabels`.** The macro only
  knows what the consumer tells it; locale-aware copy is the
  consumer's responsibility.
- **Emitting inline `<script>` from the macro.** Forbidden. The
  client.js is loaded separately; CSP `script-src` policies that
  forbid inline scripts must continue to work.

## Nunjucks-specific notes

### Autoescape

`nunjucks.configure({ autoescape: true })` is mandatory. The macro
emits `opts.label` inside an HTML attribute (`aria-label="…"`);
without autoescape, a label like `Hello " onclick="alert(1)`
would inject script. All shipped tests run with autoescape on.

### `caller()` and ARIA

When a consumer wraps the macro with `{% call %}` to replace the
default `<option>` rendering, the outer `<select>` root is
preserved. The caller's markup goes inside the select; it must
not introduce a competing `role="group"` or `role="listbox"`.

If the caller drops the native `<option>` elements entirely (e.g.
for a swatch button group), the consumer must add `aria-pressed` to
each button and wire `setTheme(slug)` from a click handler. See
[`../docs/custom-rendering.md`](../docs/custom-rendering.md).

## Testing for a11y

```ts
const html = renderMacro({
    label: "Theme",
    themesUrl: "/t/",
    themes: ["light", "dark"],
});
expect(html).toContain('<select');
expect(html).toContain('class="theme-select');
expect(html).toContain('aria-label="Theme"');
```

For broader a11y testing run axe-core against a real Nunjucks host
page (Eleventy + Playwright is the canonical recipe). See
[`../../AGENTS/accessibility.md`](../../AGENTS/accessibility.md)
for the catalog-wide guidance.
