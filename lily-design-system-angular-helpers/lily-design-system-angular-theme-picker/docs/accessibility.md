# Accessibility

The picker targets WCAG 2.2 AAA and follows the WAI-ARIA Authoring
Practices 1.2 Radio Group pattern.

## Roles and properties

| Element                       | Role / Property            | Source         |
| ----------------------------- | -------------------------- | -------------- |
| `<fieldset>`                  | `role="radiogroup"`        | Picker         |
| `<fieldset>`                  | `aria-label={label}`       | Consumer input |
| `<input type="radio">`        | implicit `role="radio"`    | Browser        |
| `<input type="radio">`        | `aria-checked` (implicit)  | Browser        |
| `<input type="radio">` × N    | shared `name`              | Picker         |

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
3. The `[(value)]` two-way binding in user code.

## Internationalisation

- `label` is consumer-supplied; pass a translated string.
- `themeLabels` entries are consumer-supplied; localise the values.
- The component never emits hardcoded English (or any other natural
  language) strings, including the word "default".

## Visible focus

The picker does not suppress `:focus` or `:focus-visible` styling.
The consumer's CSS is responsible for the visible focus ring. NHS-UK
and Lily themes ship a high-contrast focus outline that meets AAA.

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

- **Hiding the radio inputs with `display: none`.** That removes
  them from the accessibility tree. Use a visually-hidden pattern
  (`clip-path: inset(50%)` or the `.sr-only` recipe) instead.
- **Forgetting to translate `themeLabels`.** The picker only knows
  what the consumer tells it; locale-aware copy is the consumer's
  responsibility.
- **Binding `aria-label` via interpolation instead of `[attr.…]`.**
  `aria-label="{{ label() }}"` always emits the attribute (even as
  `""` or `"null"`); `[attr.aria-label]="label() || null"` removes
  it when empty. The picker uses the latter.

## Angular-specific notes

### `[attr.aria-label]` vs `aria-label`

The picker binds via `[attr.aria-label]="label() || null"`. The
`null` sentinel removes the attribute when the input is empty,
matching DOM expectations. Don't bypass this from a wrapper by
overriding `aria-label="something"` statically.

### `host` bindings don't reach the inner fieldset

Angular forwards `class`, `style`, and `(event)` bindings declared
on the host element to the host node, not to the inner `<fieldset>`.
That means a consumer who writes
`<lily-theme-picker class="my-extra">` ends up with `my-extra` on
the *host* node. To get a class hook on the fieldset itself, use
the `className` input.

### `aria-current` is consumer-supplied

The helpers don't add `aria-current` automatically. When you build
a multi-item navigation that needs it, set it via a custom
template (when content projection lands) or via your own wrapper.

## Testing for a11y

```ts
const fixture = mount({ label: "Theme", themesUrl: "/t/", themes: ["light", "dark"] });
const fieldset = fixture.nativeElement.querySelector("fieldset");
expect(fieldset.getAttribute("role")).toBe("radiogroup");
expect(fieldset.getAttribute("aria-label")).toBe("Theme");
expect(fixture.nativeElement.querySelectorAll('input[type="radio"]').length).toBe(2);
```

For broader a11y testing run axe-core in a real Angular host. The
catalog has no built-in axe runner because the helpers ship no CSS
— a meaningful audit must run against the consumer's styled markup.
