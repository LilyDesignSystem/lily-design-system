# Accessibility — `<theme-select>` (HTML helper)

The control targets WCAG 2.2 AAA and implements the WAI-ARIA APG
listbox pattern: an icon button that opens a dropdown
`role="listbox"`. It is **not** a native `<select>`, so none of the
keyboard behaviour comes from the platform. This file is the
custom-element-flavoured view; the canonical contract is in
[`../spec/index.md`](../spec/index.md) §6.

## Roles and properties

| Element                              | Role / Property                                | Source        |
| ------------------------------------ | ---------------------------------------------- | ------------- |
| `<theme-select>` (host)              | none (silent container)                        | —             |
| `<div class="theme-select">`         | none (styling root)                            | Element       |
| `<button class="theme-select-button">` | implicit `role="button"`                     | Browser       |
| `<button>`                           | `aria-label={label}`                           | Consumer attr |
| `<button>`                           | `aria-haspopup="listbox"`                      | Element       |
| `<button>`                           | `aria-expanded` (synced open/closed)           | Element       |
| `<button>`                           | `aria-controls={listId}`                       | Element       |
| `<span class="theme-select-icon">`   | `aria-hidden="true"`                           | Element       |
| `<ul class="theme-select-list">`      | `role="listbox"`, `aria-label={label}`, `tabindex="-1"` | Element |
| `<ul>`                               | `hidden` while closed; `aria-activedescendant` only while open | Element |
| `<li class="theme-select-option">`   | `role="option"`, unique `id`, `aria-selected`  | Element       |
| `<li>`                               | `data-active` when keyboard-highlighted        | Element       |
| `<input type="hidden">`              | none — form participation only                 | Element       |

The host `<theme-select>` element has no implicit ARIA role. It is
a lifecycle container; the rendered button and listbox are what
assistive technology announces.

**`data-active` is not `aria-selected`.** `data-active` is the
keyboard highlight (the active descendant); `aria-selected` is the
chosen theme. While the list is open they usually differ.

**Focus model.** Focus moves to the `<ul>` when the list opens and
never lands on an `<li>`. The highlighted option is conveyed solely
through `aria-activedescendant`, per the APG.

## Keyboard contract

Implemented in JavaScript — nothing here is inherited from the
platform.

On the button:

| Key                 | Action                                                        |
| ------------------- | ------------------------------------------------------------- |
| `Tab` / `Shift+Tab` | Move focus onto / off the button.                             |
| `ArrowDown`         | Open with the selected option active (else index 0).          |
| `Enter`             | Same as `ArrowDown`.                                          |
| `Space`             | Same as `ArrowDown`.                                          |
| `ArrowUp`           | Open with the **last** option active.                         |

On the listbox (`<ul>`, which holds focus while open):

| Key                 | Action                                                        |
| ------------------- | ------------------------------------------------------------- |
| `ArrowDown`         | Move the active option down one; clamps at the last (no wrap). |
| `ArrowUp`           | Move the active option up one; clamps at the first.           |
| `Home` / `End`      | Make the first / last option active.                          |
| `Enter`             | Select the active option, apply, close, refocus the button.   |
| `Space`             | Same as `Enter`.                                              |
| `Escape`            | Close and refocus the button **without** changing the value.  |
| `Tab`               | Close without stealing focus back.                            |
| printable character | Typeahead over option labels; buffer resets after 500 ms.     |

Pointer equivalents: the button toggles, an option click selects, a
click outside the root closes, and focus leaving the root closes.

## State signals

The active state is exposed in four independent channels — no
colour-only meaning is required:

1. `aria-selected="true"` on one `<li role="option">`.
2. `data-theme="<slug>"` on the target element (default `<html>`).
3. The `value` attribute on the `<theme-select>` host.
4. The hidden `<input>`'s `value` (for form submission).

Note that the **closed** button exposes none of them visibly — it
shows only a glyph. See the tradeoffs below.

## Known tradeoffs

Canonical list: [`../spec/index.md` §6.5](../spec/index.md#65-known-tradeoffs).
In short:

1. **Icon-only control.** `aria-label` is the entire accessible
   name, so a vague `label` makes the control unusable to
   screen-reader users, and the absence of a visible label fails
   WCAG 2.5.3 Label in Name unless the consumer supplies one.
2. **A custom listbox is weaker than a native `<select>`** —
   combobox semantics, platform keyboard behaviour, mobile OS
   pickers, and typeahead all used to be free and battle-tested; an
   APG listbox has more variable AT support and no native mobile
   picker.
3. **Glyph rendering is platform-dependent** — no font is bundled,
   so the glyph may render as colour emoji, monochrome, or tofu.
   Override `renderButtonContent()` with an inline SVG when the
   appearance must be guaranteed.

## CustomEvent vs ARIA live region

`themechange` is a change notification for consumer code, not for
assistive technology. Selecting an option updates `aria-selected`,
which a screen reader announces while the list is open — but once
the list closes, the button shows only a glyph and says nothing
about the active theme.

That makes the status region the **default pattern**, not an
optional extra: add a `role="status"` or `aria-live="polite"`
element and write into it from your `themechange` listener:

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

The control does not suppress `:focus` or `:focus-visible` styling
on the button or the list. The consumer's CSS is responsible for the
visible focus ring. NHS-UK and Lily themes ship a high-contrast
focus outline that meets AAA.

Note that while the list is open, focus is on the `<ul>` — style
`.theme-select-list:focus-visible` as well as the button, and give
`.theme-select-option[data-active]` a visible highlight, or keyboard
users cannot see where they are.

## Reduced motion

The control performs no animation. Theme CSS files are responsible
for respecting `prefers-reduced-motion` if they introduce
transitions on the `data-theme` swap.

## Screen-reader smoke test

- VoiceOver (macOS) announces the closed control as "{label},
  pop-up button, collapsed", and on open reads the listbox label
  followed by the active option.
- NVDA announces "{label} button collapsed", then "{label} list box"
  and the active option as the active descendant moves.
- Because the button is icon-only, nothing announces the active
  theme while the list is closed. Verify the consumer's status
  region covers that gap.

## Common mistakes to avoid

- **Adding a redundant `role` on the host element.** The rendered
  button and list already carry the pattern's roles; overriding
  produces confusing announcements.
- **Hiding options with `display: none`.** That removes them from
  the accessibility tree. Use the element's own `hidden` toggling
  on the list instead.
- **Styling `[data-active]` and `[aria-selected]` identically.**
  They mean different things; a keyboard user needs to distinguish
  "where I am" from "what is chosen".
- **Passing a vague `label`.** It is the entire accessible name of
  an icon-only button.
- **Forgetting to translate `theme-labels`.** The control only knows
  what the consumer tells it; locale-aware copy is the consumer's
  responsibility.
- **Wrapping the control in a Shadow DOM.** It uses light DOM;
  placing it inside a closed shadow root breaks `aria-labelledby`
  and `aria-controls` references from outside.

## Custom-element-specific notes

- `aria-label` on the button and the list is computed from the
  host's `label` attribute. Changing `label` re-renders.
- The keyboard contract is the element's own JS. Subclasses that
  replace the rendered DOM (Tier 2 in
  [`../docs/custom-rendering.md`](../docs/custom-rendering.md))
  inherit responsibility for it, because the base class's handlers
  are bound to the DOM it built. Subclasses that only override
  `renderButtonContent()` keep the whole contract intact.
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

const button = el.querySelector<HTMLButtonElement>(".theme-select-button")!;
expect(button.getAttribute("aria-label")).toBe("Theme");
expect(button.getAttribute("aria-haspopup")).toBe("listbox");
expect(button.getAttribute("aria-expanded")).toBe("false");

const list = document.getElementById(button.getAttribute("aria-controls")!)!;
expect(list.getAttribute("role")).toBe("listbox");
expect(el.querySelectorAll('[role="option"]').length).toBe(2);
```

For broader a11y testing run axe-core in a real browser host. See
[`../../AGENTS/accessibility.md`](../../AGENTS/accessibility.md) for
the catalog-wide guidance, and
[`../examples/`](../examples/) for runnable `.html` files that you
can axe-audit directly.
