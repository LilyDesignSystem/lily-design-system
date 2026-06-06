# Accessibility — ThemePicker (Vue)

The picker targets WCAG 2.2 AAA and follows the WAI-ARIA Authoring
Practices 1.2 Radio Group pattern. This file is the Vue-flavoured
view of the contract; the canonical contract is in
[`../spec.md`](../spec.md) §6.

## Roles and properties

| Element                       | Role / Property            | Source        |
| ----------------------------- | -------------------------- | ------------- |
| `<fieldset>`                  | `role="radiogroup"`        | Picker        |
| `<fieldset>`                  | `aria-label={label}`       | Consumer prop |
| `<input type="radio">`        | implicit `role="radio"`    | Browser       |
| `<input type="radio">`        | `aria-checked` (implicit)  | Browser       |
| `<input type="radio">` × N    | shared `name`              | Picker        |

The picker does not add ARIA where native semantics already cover
the need. There is no `aria-pressed`, no roving tabindex, no manual
focus management — the native radio behaviour is exactly the
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

## State signals

The active state is exposed in three independent channels — no
colour-only meaning is required:

1. `aria-checked` on the selected radio.
2. `data-theme="<slug>"` on the target element (default `<html>`).
3. The `value` prop (bound via `v-model:value`).

## Internationalisation

- `label` is consumer-supplied; pass a translated string.
- `themeLabels` entries are consumer-supplied; localise the values.
- The component never emits hardcoded English (or any other natural
  language) strings, including the word "default".

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

- **Replacing the fieldset with a div in custom-rendering.** The
  default slot renders inside the fieldset; do not wrap a div
  *around* the picker if you need group semantics.
- **Hiding the radio inputs with `display: none`.** That removes
  them from the accessibility tree. Use a visually-hidden pattern
  (`clip-path: inset(50%)` or the `.sr-only` recipe) instead.
- **Forgetting to translate `themeLabels`.** The picker only knows
  what the consumer tells it; locale-aware copy is the consumer's
  responsibility.
- **Setting `inheritAttrs: false`.** Don't. Vue's default attribute
  fall-through is part of the contract; turning it off breaks
  `data-testid`, `id`, and event handler pass-through.

## Vue-specific notes

- `aria-label` is bound via `:aria-label="label"`. Avoid passing it
  twice (e.g. `aria-label="X"` plus `:aria-label="label"`); the
  static one wins and you lose the prop.
- When a consumer scopes the picker via a default slot, the
  fieldset and its `role="radiogroup"` + `aria-label` still apply.
  The slot replaces the **inside**, not the wrapping group.
- Vue's reactivity does not affect ARIA announcements. The browser
  announces what's in the DOM; making sure the DOM is correct is
  enough.

## Testing for a11y

```ts
const wrapper = mount(ThemePicker, {
    props: { label: "Theme", themesUrl: "/t/", themes: ["light", "dark"] },
});
expect(wrapper.find("fieldset").attributes("role")).toBe("radiogroup");
expect(wrapper.find("fieldset").attributes("aria-label")).toBe("Theme");
expect(wrapper.findAll('input[type="radio"]')).toHaveLength(2);
```

For broader a11y testing run axe-core in a real Vue host. See
[`../../../AGENTS/accessibility.md`](../../AGENTS/accessibility.md)
for the catalog-wide guidance.
