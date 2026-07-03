# Accessibility — `<theme-select>` (HTML helper)

The select targets WCAG 2.2 AAA and uses a native `<select>`, which
maps to the platform combobox (Listbox / Combobox) model. This file
is the custom-element-flavoured view; the canonical contract is in
[`../spec/index.md`](../spec/index.md) §6.

## Roles and properties

| Element                       | Role / Property            | Source        |
| ----------------------------- | -------------------------- | ------------- |
| `<theme-select>` (host)       | none (silent container)    | —             |
| Rendered `<select>`           | implicit `role="combobox"` | Browser       |
| Rendered `<select>`           | `aria-label={label}`       | Consumer attr |
| Rendered `<select>`           | `name`                     | Select        |
| `<option>`                    | implicit `role="option"`   | Browser       |
| `<option>`                    | selected state (implicit)  | Browser       |

The host `<theme-select>` element has no implicit ARIA role. It is
a lifecycle container; the rendered `<select>` is what assistive
technology announces.

## Keyboard contract

Provided entirely by the platform's native `<select>`:

| Key                 | Action                                           |
| ------------------- | ------------------------------------------------ |
| `Tab`               | Move focus onto the control.                     |
| `Shift+Tab`         | Move focus backwards off the control.            |
| `Arrow Down`        | Change selection to the next option.             |
| `Arrow Up`          | Change selection to the previous option.         |
| `Home` / `End`      | Select the first / last option.                  |
| typeahead           | Jump to the option matching typed characters.    |
| `Enter` / `Space`   | Open the option list (where the platform pops it up). |
| `Escape`            | Close the option list.                           |

## State signals

The active state is exposed in three independent channels — no
colour-only meaning is required:

1. The selected `<option>` in the `<select>`.
2. `data-theme="<slug>"` on the target element (default `<html>`).
3. The `value` attribute on the `<theme-select>` host.

## CustomEvent vs ARIA live region

`themechange` is a change notification for consumer code, not for
assistive technology. The selection change is announced because
the underlying control state (the selected option) changes, which
the platform handles for native `<select>`.

If you want the theme change announced via an ARIA live region
(e.g. "Theme changed to dark"), add a separate `role="status"` or
`aria-live` element and write into it from your `themechange`
listener:

```ts
const status = document.querySelector("#theme-status")!;
document.querySelector("theme-select")!.addEventListener("themechange", (e) => {
    status.textContent = `Theme changed to ${(e as CustomEvent).detail.theme}`;
});
```

## Internationalisation

- `label` is consumer-supplied; pass a translated string.
- `theme-labels` entries are consumer-supplied; localise the values.
- The component never emits hardcoded English (or any other
  natural language) strings, including the word "default".

## Visible focus

The select does not suppress `:focus` or `:focus-visible` styling.
The consumer's CSS is responsible for the visible focus ring.
NHS-UK and Lily themes ship a high-contrast focus outline that
meets AAA.

## Reduced motion

The select performs no animation. Theme CSS files are responsible
for respecting `prefers-reduced-motion` if they introduce
transitions on the `data-theme` swap.

## Screen-reader smoke test

- VoiceOver (macOS) announces the control as "{label}, pop-up
  button" and each option as "{labelFor(slug)}, selected / not
  selected".
- NVDA announces "{label} combo box" and the current option.
- Selection changes are announced because the underlying control
  state (the selected option) changes.

## Common mistakes to avoid

- **Adding a redundant `role` on the host element.** The rendered
  `<select>` already carries the combobox role; overriding it
  produces confusing announcements.
- **Hiding the `<option>` elements with `display: none`.** That
  removes them from the accessibility tree. Keep the native
  `<select>` intact; if you need a different visual, subclass and
  own your own a11y contract.
- **Forgetting to translate `theme-labels`.** The select only knows
  what the consumer tells it; locale-aware copy is the consumer's
  responsibility.
- **Wrapping the select in a Shadow DOM.** The select uses light
  DOM; placing it inside a closed shadow root breaks
  `aria-labelledby` and `aria-controls` references from outside.

## Custom-element-specific notes

- `aria-label` on the rendered `<select>` is computed from the
  host's `label` attribute. Changing `label` re-renders.
- Native `<select>` behaviour ships with the platform; the select
  adds no JS keyboard handlers. Subclasses that swap markup (e.g.
  swatch buttons) become responsible for the keyboard contract.
- `inheritAttrs`-style fall-through is moot — the host element
  *is* the attribute collector. Consumer-passed `id`, `data-*`,
  event handlers all live on `<theme-select>` itself.

## Testing for a11y

```ts
const el = document.createElement("theme-select");
el.setAttribute("label", "Theme");
el.setAttribute("themes-url", "/t/");
el.setAttribute("themes", "light,dark");
document.body.appendChild(el);

const sel = el.querySelector("select")!;
expect(sel.getAttribute("aria-label")).toBe("Theme");
expect(el.querySelectorAll("option").length).toBe(2);
```

For broader a11y testing run axe-core in a real browser host. See
[`../../AGENTS/accessibility.md`](../../AGENTS/accessibility.md) for
the catalog-wide guidance, and
[`../examples/`](../examples/) for runnable `.html` files that you
can axe-audit directly.
