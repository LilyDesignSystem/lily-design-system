# Accessibility

The select targets WCAG 2.2 AAA and uses a native HTML `<select>`,
which carries the WAI-ARIA `combobox` semantics for free.

## Roles and properties

| Element        | Role / Property            | Source         |
| -------------- | -------------------------- | -------------- |
| `<select>`     | implicit `role="combobox"` | Browser        |
| `<select>`     | `aria-label={label}`       | Consumer input |
| `<select>`     | `name`                     | Select         |
| `<option>`     | implicit `role="option"`   | Browser        |
| `<option>`     | selected state (implicit)  | Browser        |

The select does not add ARIA where native semantics already cover
the need. There is no `aria-pressed`, no manual focus management —
the native `<select>` behaviour is exactly the platform combobox.

## Keyboard contract

Provided entirely by the platform's native `<select>`:

| Key               | Action                                        |
| ----------------- | --------------------------------------------- |
| `Tab`             | Move focus to the select (one stop).          |
| `Shift+Tab`       | Move focus away from the select.              |
| `Arrow Down`      | Select the next option.                       |
| `Arrow Up`        | Select the previous option.                   |
| `Home` / `End`    | Select the first / last option.               |
| Typeahead         | Type characters to jump to a matching option. |
| `Enter` / `Space` | Open the option list (platform-dependent).    |
| `Escape`          | Close the option list.                        |

## State signals

The active state is exposed in three independent channels — no
colour-only meaning is required:

1. The selected `<option>` in the `<select>`.
2. `data-theme="<slug>"` on the target element (default `<html>`).
3. The `[(value)]` two-way binding in user code.

## Internationalisation

- `label` is consumer-supplied; pass a translated string.
- `themeLabels` entries are consumer-supplied; localise the values.
- The component never emits hardcoded English (or any other natural
  language) strings, including the word "default".

## Visible focus

The select does not suppress `:focus` or `:focus-visible` styling.
The consumer's CSS is responsible for the visible focus ring. NHS-UK
and Lily themes ship a high-contrast focus outline that meets AAA.

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

- **Hiding the `<select>` with `display: none`.** That removes it
  from the accessibility tree. Use a visually-hidden pattern
  (`clip-path: inset(50%)` or the `.sr-only` recipe) instead.
- **Forgetting to translate `themeLabels`.** The select only knows
  what the consumer tells it; locale-aware copy is the consumer's
  responsibility.
- **Binding `aria-label` via interpolation instead of `[attr.…]`.**
  `aria-label="{{ label() }}"` always emits the attribute (even as
  `""` or `"null"`); `[attr.aria-label]="label() || null"` removes
  it when empty. The select uses the latter.

## Angular-specific notes

### `[attr.aria-label]` vs `aria-label`

The select binds via `[attr.aria-label]="label() || null"`. The
`null` sentinel removes the attribute when the input is empty,
matching DOM expectations. Don't bypass this from a wrapper by
overriding `aria-label="something"` statically.

### `host` bindings don't reach the inner select

Angular forwards `class`, `style`, and `(event)` bindings declared
on the host element to the host node, not to the inner `<select>`.
That means a consumer who writes
`<lily-theme-select class="my-extra">` ends up with `my-extra` on
the *host* node. To get a class hook on the select itself, use
the `className` input.

### `aria-current` is consumer-supplied

The helpers don't add `aria-current` automatically. When you build
a multi-item navigation that needs it, set it via a custom
template (when content projection lands) or via your own wrapper.

## Testing for a11y

```ts
const fixture = mount({ label: "Theme", themesUrl: "/t/", themes: ["light", "dark"] });
const select = fixture.nativeElement.querySelector("select");
expect(select.getAttribute("aria-label")).toBe("Theme");
expect(fixture.nativeElement.querySelectorAll("option").length).toBe(2);
```

For broader a11y testing run axe-core in a real Angular host. The
catalog has no built-in axe runner because the helpers ship no CSS
— a meaningful audit must run against the consumer's styled markup.
