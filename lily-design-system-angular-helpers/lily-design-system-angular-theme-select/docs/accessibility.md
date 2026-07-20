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

The active state is exposed in two independent channels — no
colour-only meaning is required:

1. `data-theme="<slug>"` on the target element (default `<html>`).
2. The `[(value)]` two-way binding (and the `themeChange` output) in
   user code.

## The status region is part of the pattern

The `<select>` always displays its leading placeholder option, so its
own `value` is permanently `""` and the active theme is *not* one of
those channels. This keeps the control narrow, but it costs something
real: a screen-reader user focusing the control hears the accessible
name and the placeholder word ("Theme"), **not** the theme currently
in effect, and no option in the open list is marked selected. The
active theme is not discoverable from the combobox alone.

Because Lily targets WCAG 2.2 AAA, the compensation is **the default,
not a suggestion**. Every example in [`examples/`](../examples/) ships
it, the [quick start](../index.md#quick-start) opens with it, and it
is what an adopter copying this package gets unless they take it out.
Removing it is the deliberate choice; adding it is not.

The pattern: bind `[(value)]` and render a visible status line beside
the control.

```html
<lily-theme-select #themeSelect label="Theme" themesUrl="/t/"
                   [themes]="themes" [(value)]="theme" />

<p class="theme-select-status" aria-live="polite">
    Active theme: {{ themeSelect.labelFor(theme()) }}
</p>
```

Why each part is the way it is:

- **Visible, not `sr-only`.** Naming the current setting in plain text
  serves sighted, low-vision, and cognitively-impaired users as well as
  screen-reader users, and it needs no live-region timing care. AAA
  favours the visible form.
- **`aria-live="polite"` announces mutations only.** The region is
  silent on first paint and speaks once on each subsequent change — a
  confirmation per switch, not a greeting on load. (`role="status"`
  carries an implicit `aria-live="polite"`; either is fine, but do not
  use `assertive` — a theme change is not an interruption.)
- **`labelFor()`** is the component's own label resolver, reached
  through the `#themeSelect` template reference, so the status text
  shows the same human label as the option ("Abyss", not `abyss`).
- **`theme-select-status`** is the class hook, kebab-case like the rest
  of the system. See [styling.md](./styling.md).

If a design truly cannot spare the space, keep the element and its
`aria-live` and hide it visually — the `.sr-only` recipe is in
[styling.md](./styling.md#visually-hidden-status-line). Dropping it
entirely puts the control back in the state described at the top of
this section.

### What this does and does not fix

Honest accounting. The status region gives the user a way to *learn*
the active theme, announced on every change. It does not restore the
native combobox semantics: focusing the control still does not speak
the current value, the open list still marks no option as selected,
and a user arrowing through options still gets no "selected" state to
orient by. Those are real losses that no sibling element recovers —
they are the price of the placeholder-pinned control, and the reason
this tradeoff is documented rather than declared solved.

## Internationalisation

- `label` is consumer-supplied; pass a translated string.
- `themeLabels` entries are consumer-supplied; localise the values.
- The component never emits hardcoded English (or any other natural
  language) strings, including the word "default".

## Visible focus

The select does not suppress `:focus` or `:focus-visible` styling.
The consumer's CSS is responsible for the visible focus ring. NHS-UK
and Lily™ themes ship a high-contrast focus outline that meets AAA.

## Reduced motion

The select performs no animation. Theme CSS files are responsible
for respecting `prefers-reduced-motion` if they introduce
transitions on the `data-theme` swap.

## Screen-reader smoke test

- VoiceOver (macOS) announces the control as "{label}, pop-up
  button, {placeholder}" — the placeholder word, never the active
  theme.
- NVDA announces "{label} combo box, {placeholder}".
- Opening the list announces each option as "{labelFor(slug)}, N of
  M". Because the control's own value stays pinned to the
  placeholder, **no option is announced as selected**, including the
  active one.
- Selection changes are *not* announced by the control itself. They
  are announced by the `theme-select-status` live region described
  above — which is why that region is part of the default pattern.

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

---

Lily™ and Lily Design System™ are trademarks.
