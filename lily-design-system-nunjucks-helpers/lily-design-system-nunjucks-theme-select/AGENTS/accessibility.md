# Accessibility — ThemeSelect (Nunjucks)

The control targets WCAG 2.2 AAA using an icon button that opens a
listbox, following the WAI-ARIA APG listbox pattern. This file is the
Nunjucks-flavoured view; the canonical contract is in
[`../spec/index.md`](../spec/index.md) §6.

## Roles and properties

| Element                    | Role / Property                     | Source              |
| -------------------------- | ----------------------------------- | ------------------- |
| `<button type="button">`   | implicit `role="button"`            | Browser             |
| `<button>`                 | `aria-label="{label}"`              | `opts.label`        |
| `<button>`                 | `aria-haspopup="listbox"`           | Macro               |
| `<button>`                 | `aria-expanded="true|false"`        | Macro, then client  |
| `<button>`                 | `aria-controls="{id}-list"`         | Macro               |
| `<span class="…-icon">`    | `aria-hidden="true"`                | Macro               |
| `<ul>`                     | `role="listbox"`                    | Macro               |
| `<ul>`                     | `aria-label="{label}"`              | `opts.label`        |
| `<ul>`                     | `tabindex="-1"`                     | Macro               |
| `<ul>`                     | `aria-activedescendant="{option id}"` | Client (while open) |
| `<li>`                     | `role="option"`                     | Macro               |
| `<li>`                     | `aria-selected="true|false"`        | Macro, then client  |
| `<input type="hidden">`    | `name` + `value`                    | Macro, then client  |

The button is icon-only, so `aria-label` is its **only** accessible
name. The glyph (U+25D1 CIRCLE WITH RIGHT HALF BLACK) is wrapped in
`aria-hidden="true"` precisely so it can never leak into the name.
A consumer-supplied glyph, via the `{% call %}` block, must carry
`aria-hidden="true"` for the same reason.

`aria-selected` tracks the **applied** theme.
`aria-activedescendant` (plus the `data-active` CSS hook) tracks the
option the user is currently on. They differ while the user is
arrowing through the list and converge on confirmation.

## Keyboard contract

Implemented by the client.js, following the APG listbox pattern.
None of it works before the script loads — see
[`./ssr.md`](./ssr.md).

| Key                  | Focus     | Action                                                            |
| -------------------- | --------- | ----------------------------------------------------------------- |
| `Tab` / `Shift+Tab`  | Button    | Move focus to / away from the button (one stop).                  |
| `Arrow Down`         | Button    | Open; active option = the selected one, else the first.           |
| `Enter` / `Space`    | Button    | Same as `Arrow Down`.                                             |
| `Arrow Up`           | Button    | Open with the **last** option active.                             |
| `Arrow Down` / `Up`  | Listbox   | Move the active option; clamps at the ends rather than wrapping.  |
| `Home` / `End`       | Listbox   | Jump to the first / last option.                                  |
| `Enter` / `Space`    | Listbox   | Select the active option, apply it, close, refocus the button.    |
| `Escape`             | Listbox   | Close and refocus the button; the theme is unchanged.             |
| `Tab`                | Listbox   | Close without stealing focus back, so Tab proceeds normally.      |
| Printable characters | Listbox   | Typeahead over the option labels; buffer resets after 500 ms.     |

Opening moves DOM focus to the `<ul>`; the active option is conveyed
via `aria-activedescendant` rather than by moving focus onto the
`<li>`. Modifier chords (`Ctrl`/`Meta`/`Alt` + a character) are not
treated as typeahead, so browser shortcuts keep working.

Clicking an option selects it. Clicking outside the root, or focus
leaving the root, closes the listbox without refocusing the button.

## State signals

The active state is exposed in four independent channels — no
colour-only meaning is required:

1. `data-theme="<slug>"` on the target element (default `<html>`).
2. The managed `<link rel="stylesheet" data-lily-theme-select="…">`
   in `document.head`.
3. `aria-selected="true"` on exactly one `<li role="option">`.
4. The hidden input's `value`.

Channel 3 is only audible once the user opens the listbox: the
collapsed button announces its label, not the active theme. The
compensating `.theme-select-status` region (`aria-live="polite"`,
fed from `onChange`) is part of the default pattern and ships in the
examples — see
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

- VoiceOver (macOS) announces the collapsed trigger as "{label},
  pop-up button, collapsed", and each option as "{labelFor(slug)},
  selected / not selected" once the listbox opens.
- NVDA announces "{label} button, collapsed", then reads the listbox
  and its active option after opening.
- The collapsed control does **not** announce the active theme.
  That is what the `.theme-select-status` live region compensates
  for.

## Common mistakes to avoid

- **Putting the label text in the caller block.** The `{% call %}`
  body replaces the glyph *inside* the button and should be
  `aria-hidden="true"`. The accessible name must keep coming from
  `aria-label`.
- **Rendering `<option>` elements from the caller block.** Stale
  advice from the native-`<select>` era: the caller block no longer
  renders options at all.
- **Reusing a `name` across two instances without distinct `id`s.**
  The listbox and option ids are derived from `id`, which defaults to
  `"theme-select-{name}"`. Duplicate ids break `aria-controls` and
  `aria-activedescendant`.
- **Hiding the button with `display: none`.** That removes it from
  the accessibility tree. Use a visually-hidden pattern
  (`clip-path: inset(50%)` or the `.sr-only` recipe) instead.
- **Styling the open listbox with `visibility`/opacity alone.** The
  client toggles the `hidden` attribute; do not fight it with CSS
  that leaves a closed list in the accessibility tree.
- **Forgetting to translate `opts.themeLabels`.** The macro only
  knows what the consumer tells it; locale-aware copy is the
  consumer's responsibility.
- **Emitting inline `<script>` from the macro.** Forbidden. The
  client.js is loaded separately; CSP `script-src` policies that
  forbid inline scripts must continue to work.
- **Claiming the control degrades gracefully.** It does not. Without
  the client.js the button opens nothing; only the pre-filled hidden
  input survives.

## Nunjucks-specific notes

### Autoescape

`nunjucks.configure({ autoescape: true })` is mandatory. The macro
emits `opts.label` inside an HTML attribute (`aria-label="…"`);
without autoescape, a label like `Hello " onclick="alert(1)`
would inject script. All shipped tests run with autoescape on.

### `caller()` and ARIA

When a consumer wraps the macro with `{% call %}`, the block body
replaces only the default glyph `<span>` inside the button. The
root `<div>`, the hidden input, the button's ARIA attributes, and
the whole listbox are still macro-rendered, so the ARIA contract
above is preserved by construction.

The one obligation on the consumer is that the supplied glyph must
be `aria-hidden="true"` (and, for SVG, `focusable="false"`), so the
button's accessible name stays exactly `aria-label`. Do not put a
nested interactive element inside the button. See
[`../docs/custom-rendering.md`](../docs/custom-rendering.md).

## Testing for a11y

```ts
const root = mountIntoBody(
    renderMacro({ label: "Theme", themesUrl: "/t/", themes: ["light", "dark"] }),
);
const button = root.querySelector(".theme-select-button")!;
const list = root.querySelector(".theme-select-list")!;

expect(root.classList.contains("theme-select")).toBe(true);
expect(button.getAttribute("aria-label")).toBe("Theme");
expect(button.getAttribute("aria-haspopup")).toBe("listbox");
expect(button.getAttribute("aria-expanded")).toBe("false");
expect(button.getAttribute("aria-controls")).toBe(list.id);
expect(list.getAttribute("role")).toBe("listbox");
expect(root.querySelector(".theme-select-icon")!.getAttribute("aria-hidden"))
    .toBe("true");
```

For broader a11y testing run axe-core against a real Nunjucks host
page (Eleventy + Playwright is the canonical recipe). See
[`../../AGENTS/accessibility.md`](../../AGENTS/accessibility.md)
for the catalog-wide guidance.
