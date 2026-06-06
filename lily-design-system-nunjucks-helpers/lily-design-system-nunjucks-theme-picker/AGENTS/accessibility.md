# Accessibility — ThemePicker (Nunjucks)

The picker targets WCAG 2.2 AAA and follows the WAI-ARIA Authoring
Practices 1.2 Radio Group pattern. This file is the
Nunjucks-flavoured view; the canonical contract is in
[`../spec.md`](../spec.md) §6.

## Roles and properties

| Element                       | Role / Property            | Source        |
| ----------------------------- | -------------------------- | ------------- |
| `<fieldset>`                  | `role="radiogroup"`        | Macro         |
| `<fieldset>`                  | `aria-label="{label}"`     | `opts.label`  |
| `<input type="radio">`        | implicit `role="radio"`    | Browser       |
| `<input type="radio">`        | `aria-checked` (implicit)  | Browser       |
| `<input type="radio">` × N    | shared `name`              | Macro         |

The macro does not add ARIA where native semantics already cover
the need. There is no `aria-pressed`, no roving `tabindex`, no
manual focus management — the native radio behaviour is exactly the
WAI-ARIA Authoring Practices pattern.

## Keyboard contract

Provided entirely by the platform's native radio inputs:

| Key                | Action                                            |
| ------------------ | ------------------------------------------------- |
| `Tab`              | Move focus into / out of the group.               |
| `Shift+Tab`        | Move focus backwards out of the group.            |
| `Arrow Down/Right` | Move selection to the next option.                |
| `Arrow Up/Left`    | Move selection to the previous option.            |
| `Space`            | Re-select the focused option (rarely needed).     |
| `Home` / `End`     | Move to first / last option (most browsers).      |

The client.js never installs JS keyboard handlers; the native
radios are the correct mechanism.

## State signals

The active state is exposed in three independent channels — no
colour-only meaning is required:

1. `aria-checked` on the selected radio.
2. `data-theme="<slug>"` on the target element (default `<html>`).
3. The managed `<link rel="stylesheet" data-lily-theme-picker="…">`
   in `document.head`.

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

- VoiceOver (macOS) announces the group as "{label}, radiogroup"
  and each option as "{labelFor(slug)}, radio button, selected /
  not selected".
- NVDA announces "{label} grouping" and each option similarly.
- Selection changes are announced because the underlying control
  state (checked) changes.

## Common mistakes to avoid

- **Replacing the fieldset with a div in the caller block.** The
  `{% call %}` block renders inside the fieldset; do not wrap a
  div *around* the macro invocation if you need group semantics.
- **Hiding the radio inputs with `display: none`.** That removes
  them from the accessibility tree. Use a visually-hidden pattern
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
default rendering, the outer `<fieldset role="radiogroup">` is
preserved. The caller's markup goes inside the fieldset; it must
not introduce a competing `role="group"` or `role="listbox"`.

If the caller drops the native radios entirely (e.g. for a swatch
button group), the consumer must add `aria-pressed` to each
button and wire `setTheme(slug)` from a click handler. See
[`../docs/custom-rendering.md`](../docs/custom-rendering.md).

## Testing for a11y

```ts
const html = renderMacro({
    label: "Theme",
    themesUrl: "/t/",
    themes: ["light", "dark"],
});
expect(html).toContain('<fieldset');
expect(html).toContain('role="radiogroup"');
expect(html).toContain('aria-label="Theme"');
```

For broader a11y testing run axe-core against a real Nunjucks host
page (Eleventy + Playwright is the canonical recipe). See
[`../../AGENTS/accessibility.md`](../../AGENTS/accessibility.md)
for the catalog-wide guidance.
