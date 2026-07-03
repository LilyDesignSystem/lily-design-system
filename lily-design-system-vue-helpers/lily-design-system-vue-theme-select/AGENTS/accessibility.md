# Accessibility — ThemeSelect (Vue)

The select targets WCAG 2.2 AAA and uses a native HTML `<select>`,
which carries the WAI-ARIA `combobox` semantics for free. This file
is the Vue-flavoured view of the contract; the canonical contract is
in [`../spec/index.md`](../spec/index.md) §6.

## Roles and properties

| Element        | Role / Property            | Source        |
| -------------- | -------------------------- | ------------- |
| `<select>`     | implicit `role="combobox"` | Browser       |
| `<select>`     | `aria-label={label}`       | Consumer prop |
| `<select>`     | `name`                     | Select        |
| `<option>`     | implicit `role="option"`   | Browser       |
| `<option>`     | selected state (implicit)  | Browser       |

The select does not add ARIA where native semantics already cover
the need. There is no `aria-pressed`, no manual focus management —
the native `<select>` behaviour is exactly the platform combobox.

## Keyboard contract

Provided entirely by the platform's native `<select>`:

| Key                  | Action                                          |
| -------------------- | ----------------------------------------------- |
| `Tab`                | Move focus to the select (one stop).            |
| `Shift+Tab`          | Move focus away from the select.                |
| `Arrow Down`         | Select the next option.                         |
| `Arrow Up`           | Select the previous option.                     |
| `Home` / `End`       | Select the first / last option.                 |
| Typeahead            | Type characters to jump to a matching option.   |
| `Enter` / `Space`    | Open the option list (platform-dependent).      |
| `Escape`             | Close the option list.                          |

## State signals

The active state is exposed in three independent channels — no
colour-only meaning is required:

1. The selected `<option>` in the `<select>`.
2. `data-theme="<slug>"` on the target element (default `<html>`).
3. The `value` prop (bound via `v-model:value`).

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

- VoiceOver (macOS) announces the control as "{label}, pop-up
  button" and each option as "{labelFor(slug)}, selected / N of M".
- NVDA announces "{label} combo box" and each option similarly.
- Selection changes are announced because the underlying control
  value changes.

## Common mistakes to avoid

- **Replacing the `<select>` with a div in custom-rendering.** The
  default slot renders inside the `<select>`; do not wrap a div
  *around* the select if you need combobox semantics.
- **Hiding the `<select>` with `display: none`.** That removes it
  from the accessibility tree. Use a visually-hidden pattern
  (`clip-path: inset(50%)` or the `.sr-only` recipe) instead.
- **Forgetting to translate `themeLabels`.** The select only knows
  what the consumer tells it; locale-aware copy is the consumer's
  responsibility.
- **Setting `inheritAttrs: false`.** Don't. Vue's default attribute
  fall-through is part of the contract; turning it off breaks
  `data-testid`, `id`, and event handler pass-through.

## Vue-specific notes

- `aria-label` is bound via `:aria-label="label"`. Avoid passing it
  twice (e.g. `aria-label="X"` plus `:aria-label="label"`); the
  static one wins and you lose the prop.
- When a consumer scopes the select via a default slot, the
  `<select>` and its `aria-label` still apply. The slot replaces the
  **inside** (the options), not the wrapping control.
- Vue's reactivity does not affect ARIA announcements. The browser
  announces what's in the DOM; making sure the DOM is correct is
  enough.

## Testing for a11y

```ts
const wrapper = mount(ThemeSelect, {
    props: { label: "Theme", themesUrl: "/t/", themes: ["light", "dark"] },
});
expect(wrapper.find("select").attributes("aria-label")).toBe("Theme");
expect(wrapper.findAll("option")).toHaveLength(2);
```

For broader a11y testing run axe-core in a real Vue host. See
[`../../../AGENTS/accessibility.md`](../../AGENTS/accessibility.md)
for the catalog-wide guidance.
