# Accessibility — `<theme-picker>` (HTML helper)

The picker targets WCAG 2.2 AAA and follows the WAI-ARIA Authoring
Practices 1.2 Radio Group pattern. This file is the
custom-element-flavoured view; the canonical contract is in
[`../spec.md`](../spec.md) §6.

## Roles and properties

| Element                       | Role / Property            | Source        |
| ----------------------------- | -------------------------- | ------------- |
| `<theme-picker>` (host)       | none (silent container)    | —             |
| Rendered `<fieldset>`         | `role="radiogroup"`        | Picker        |
| Rendered `<fieldset>`         | `aria-label={label}`       | Consumer attr |
| `<input type="radio">`        | implicit `role="radio"`    | Browser       |
| `<input type="radio">`        | `aria-checked` (implicit)  | Browser       |
| `<input type="radio">` × N    | shared `name`              | Picker        |

The host `<theme-picker>` element has no implicit ARIA role. It is
a lifecycle container; the rendered `<fieldset>` is what assistive
technology announces.

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

## State signals

The active state is exposed in three independent channels — no
colour-only meaning is required:

1. `aria-checked` on the selected radio.
2. `data-theme="<slug>"` on the target element (default `<html>`).
3. The `value` attribute on the `<theme-picker>` host.

## CustomEvent vs ARIA live region

`themechange` is a change notification for consumer code, not for
assistive technology. The selection change is announced because
the underlying control state (checked) changes, which the platform
handles for native radios.

If you want the theme change announced via an ARIA live region
(e.g. "Theme changed to dark"), add a separate `role="status"` or
`aria-live` element and write into it from your `themechange`
listener:

```ts
const status = document.querySelector("#theme-status")!;
document.querySelector("theme-picker")!.addEventListener("themechange", (e) => {
    status.textContent = `Theme changed to ${(e as CustomEvent).detail.theme}`;
});
```

## Internationalisation

- `label` is consumer-supplied; pass a translated string.
- `theme-labels` entries are consumer-supplied; localise the values.
- The component never emits hardcoded English (or any other
  natural language) strings, including the word "default".

## Visible focus

The picker does not suppress `:focus` or `:focus-visible` styling.
The consumer's CSS is responsible for the visible focus ring.
NHS-UK and Lily themes ship a high-contrast focus outline that
meets AAA.

## Reduced motion

The picker performs no animation. Theme CSS files are responsible
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

- **Setting `role="radiogroup"` on the host element.** The rendered
  `<fieldset>` already carries the role; doubling it produces two
  announcements.
- **Hiding the radio inputs with `display: none`.** That removes
  them from the accessibility tree. Use a visually-hidden pattern
  (`clip-path: inset(50%)` or the `.sr-only` recipe) instead.
- **Forgetting to translate `theme-labels`.** The picker only knows
  what the consumer tells it; locale-aware copy is the consumer's
  responsibility.
- **Wrapping the picker in a Shadow DOM.** The picker uses light
  DOM; placing it inside a closed shadow root breaks
  `aria-labelledby` and `aria-controls` references from outside.

## Custom-element-specific notes

- `aria-label` on the rendered fieldset is computed from the
  host's `label` attribute. Changing `label` re-renders.
- Native radio behaviour ships with the platform; the picker adds
  no JS keyboard handlers. Subclasses that swap markup (e.g.
  swatch buttons) become responsible for the keyboard contract.
- `inheritAttrs`-style fall-through is moot — the host element
  *is* the attribute collector. Consumer-passed `id`, `data-*`,
  event handlers all live on `<theme-picker>` itself.

## Testing for a11y

```ts
const el = document.createElement("theme-picker");
el.setAttribute("label", "Theme");
el.setAttribute("themes-url", "/t/");
el.setAttribute("themes", "light,dark");
document.body.appendChild(el);

const fs = el.querySelector("fieldset")!;
expect(fs.getAttribute("role")).toBe("radiogroup");
expect(fs.getAttribute("aria-label")).toBe("Theme");
expect(el.querySelectorAll('input[type="radio"]').length).toBe(2);
```

For broader a11y testing run axe-core in a real browser host. See
[`../../AGENTS/accessibility.md`](../../AGENTS/accessibility.md) for
the catalog-wide guidance, and
[`../examples/`](../examples/) for runnable `.html` files that you
can axe-audit directly.
