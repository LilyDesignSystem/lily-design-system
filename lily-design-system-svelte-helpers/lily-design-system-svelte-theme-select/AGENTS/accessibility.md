# Accessibility — ThemeSelect (Svelte)

The select targets WCAG 2.2 AAA. It is an **icon button that opens a
listbox**, built to the WAI-ARIA APG **Listbox** pattern — not a
native `<select>`, and not the APG Combobox pattern. This file is the
Svelte 5 view of the contract; the canonical contract is in
[`../spec/index.md`](../spec/index.md) §6, and the full tradeoff
discussion is in [`../docs/accessibility.md`](../docs/accessibility.md).

## Roles and properties

| Element          | Role / Property                                 | Source        |
| ---------------- | ----------------------------------------------- | ------------- |
| `<button>`       | implicit `role="button"`                        | Browser       |
| `<button>`       | `aria-label={label}`                            | Consumer prop |
| `<button>`       | `aria-haspopup="listbox"`                       | Component     |
| `<button>`       | `aria-expanded="true\|false"`                   | Component     |
| `<button>`       | `aria-controls="{listId}"`                      | Component     |
| `<span>` (glyph) | `aria-hidden="true"`                            | Component     |
| `<ul>`           | `role="listbox"`                                | Component     |
| `<ul>`           | `aria-label={label}`                            | Consumer prop |
| `<ul>`           | `aria-activedescendant="{optionId}"` while open  | Component     |
| `<li>`           | `role="option"`                                 | Component     |
| `<li>`           | `aria-selected="true\|false"`                   | Component     |

Focus sits on the `<ul>` while open; the active option is conveyed by
`aria-activedescendant` rather than by moving DOM focus onto an `<li>`.

## Keyboard contract

Implemented by the component — none of it is inherited from the
platform.

Button: `Enter` / `Space` / `ArrowDown` open with the selected option
active; `ArrowUp` opens with the last option active; `Tab` moves focus
in and out (single tab stop).

Listbox: `ArrowDown` / `ArrowUp` move the active option and **clamp**
(no wrap); `Home` / `End` jump to first / last; `Enter` / `Space`
select, apply, close, and refocus the button; `Escape` closes and
refocuses without changing the value; `Tab` closes without stealing
focus back; printable characters run a typeahead over the labels with a
500 ms buffer reset, searching forward from the active option and
wrapping once.

Pointer: clicking an option selects it; clicking outside the root or
moving focus out of it closes the listbox.

## State signals

The active state is exposed in four independent channels — no
colour-only meaning is required:

1. `aria-selected="true"` on the active `<li role="option">`.
2. `data-theme="<slug>"` on the target element (default `<html>`).
3. The hidden input's `value` (form participation).
4. The `value` prop (bound via `bind:value`).

## The three tradeoffs

Do not paper over these when editing docs; state them:

1. **Icon-only naming.** The glyph is `aria-hidden`, so `aria-label` is
   the control's entire accessible name, with no visible-text fallback.
2. **Hand-rolled listbox.** Weaker assistive-technology and mobile
   support than a native `<select>`. For some audiences a native
   `<select>` — i.e. the headless `ThemeSelect` container upstream — is
   the better choice.
3. **Font-dependent glyph.** U+25D1 may substitute, render as tofu, or
   be missing entirely, depending on the device's installed fonts.

Full text and mitigations: [`../docs/accessibility.md`](../docs/accessibility.md).

## Internationalisation

- `label` is consumer-supplied; pass a translated string.
- `themeLabels` entries are consumer-supplied; localise the values.
- The component never emits hardcoded English (or any other natural
  language) strings, including the word "default".

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

Coverage varies (tradeoff 2), so treat these as expectations, not
evidence:

- VoiceOver (macOS) announces "{label}, pop-up button, collapsed";
  opening announces the listbox and the active option.
- NVDA announces "{label} button, collapsed"; arrowing announces
  "{labelFor(slug)}, selected / N of M".
- Mobile readers are the weakest case — test on device.

## Common mistakes to avoid

- **Passing an empty or untranslated `label`.** It is the entire
  accessible name; the glyph is `aria-hidden`.
- **Rendering options in the `children` snippet.** The snippet replaces
  the **glyph inside the button**; the listbox and its options are
  component-owned.
- **Rendering interactive content in the snippet.** Its output lives
  inside a `<button>`; nested interactive elements are invalid HTML.
- **Shipping no positioning CSS for `.theme-select-list`.** It renders
  in normal flow and shifts the page on open.
- **Styling `[aria-selected]` but not `[data-active]`.** Keyboard users
  then have no visible cursor.
- **Hiding the button with `display: none`.** That removes it from the
  accessibility tree. Use `clip-path: inset(50%)` instead.
- **Forgetting to translate `themeLabels`.** The select only knows
  what the consumer tells it; locale-aware copy is the consumer's
  responsibility.
- **Adding a `<style>` block to the select.** The headless rule
  forbids it; the consumer styles the kebab-case class hooks.

## Svelte-specific notes

- `aria-label` is bound on both the `<button>` and the `<ul>` via
  `aria-label={label}`. `restProps` spreads onto the **root `<div>`**,
  not onto the button, so an `aria-label` passed through rest-props
  lands in the wrong place — pass `label` instead.
- The `children` snippet replaces the glyph inside the `<button>`. The
  button's `aria-label` still wins as the accessible name, so visible
  text rendered by the snippet is overridden for assistive technology.
- `{@render children(args)}` is not a live region. If a consumer needs
  to announce "Theme changed to Dark", they write the live region
  themselves — see the status-region section in
  [`../docs/accessibility.md`](../docs/accessibility.md).
- Option ids come from the module-level `nextThemeSelectId()` counter,
  which is SSR-safe. Never swap it for `Math.random()` / `Date.now()`.

## Testing for a11y

```ts
render(ThemeSelect, {
    props: { label: "Theme", themesUrl: "/t/", themes: ["light", "dark"] },
});
const button = screen.getByRole("button");
expect(button.getAttribute("aria-label")).toBe("Theme");
expect(button.getAttribute("aria-haspopup")).toBe("listbox");
expect(button.getAttribute("aria-expanded")).toBe("false");

const list = document.getElementById(button.getAttribute("aria-controls")!);
expect(list!.getAttribute("role")).toBe("listbox");
expect(document.querySelectorAll('[role="option"]')).toHaveLength(2);
```

For broader a11y testing run axe-core in a real Svelte host. See
[`../../AGENTS/accessibility.md`](../../AGENTS/accessibility.md)
for the catalog-wide guidance.

## References

- WAI-ARIA APG — Listbox pattern:
  <https://www.w3.org/WAI/ARIA/apg/patterns/listbox/>
- WAI-ARIA APG — Select-Only Combobox (closest published example):
  <https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/>
- WCAG 2.2 AAA quick reference:
  <https://www.w3.org/WAI/WCAG22/quickref/?levels=aaa>
- WCAG 1.4.1 Use of Color:
  <https://www.w3.org/WAI/WCAG22/Understanding/use-of-color>
- WCAG 3.2.2 On Input:
  <https://www.w3.org/WAI/WCAG22/Understanding/on-input>
