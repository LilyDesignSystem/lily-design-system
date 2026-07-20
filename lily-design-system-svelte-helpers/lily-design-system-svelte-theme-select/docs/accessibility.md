# Accessibility

The select targets WCAG 2.2 AAA and uses a native HTML `<select>`,
which carries the platform combobox semantics for free.

## Roles and properties

| Element        | Role / Property            | Source        |
| -------------- | -------------------------- | ------------- |
| `<select>`     | implicit `role="combobox"` | Browser       |
| `<select>`     | `aria-label={label}`       | Consumer prop |
| `<select>`     | `name`                     | Select        |
| `<option>`     | implicit `role="option"`   | Browser       |
| `<option>`     | selected state (implicit)  | Browser       |

The select does not add ARIA where native semantics already cover the
need. There is no `aria-pressed`, no manual focus management — the
native `<select>` behaviour is exactly the platform combobox.

## Keyboard contract

Provided entirely by the platform's native `<select>`:

| Key                  | Action                                            |
| -------------------- | ------------------------------------------------- |
| `Tab`                | Move focus to the select.                         |
| `Shift+Tab`          | Move focus away from the select.                  |
| `Arrow Down`         | Select the next option.                           |
| `Arrow Up`           | Select the previous option.                       |
| `Home` / `End`       | Select the first / last option.                   |
| Typeahead            | Type characters to jump to a matching option.     |
| `Enter` / `Space`    | Open the option list (platform-dependent).        |
| `Escape`             | Close the option list.                            |

## State signals

The active state is exposed in three independent channels — no
colour-only meaning is required:

1. The selected `<option>` in the `<select>`.
2. `data-theme="<slug>"` on the target element (default `<html>`).
3. The bindable `value` prop in user code.

## Internationalisation

- `label` is consumer-supplied; pass a translated string.
- `themeLabels` entries are consumer-supplied; localise the values.
- The component never emits hardcoded English (or any other natural
  language) strings, including the word "default".

## Visible focus

The select does not suppress `:focus` or `:focus-visible` styling. The
consumer's CSS is responsible for the visible focus ring. NHS-UK and
Lily™ themes ship a high-contrast focus outline that meets AAA.

## Reduced motion

The select performs no animation. Theme CSS files are responsible for
respecting `prefers-reduced-motion` if they introduce transitions on
the `data-theme` swap.

## The placeholder tradeoff

The closed control always displays the placeholder option
(`placeholder ?? label`, e.g. "Theme") rather than the active theme
name, so that it stays as narrow as that one word.

The cost is real and worth stating plainly: **a screen-reader user does
not hear the active theme announced as the combobox value**, and no
option in the open list is marked as the selected one. The control
reads as "Theme, pop-up button, Theme" whichever theme is active.

### The compensating status region is the default pattern

Because the control cannot announce its own value, the pattern this
package ships surfaces the value next to it. This is **not an optional
mitigation** — it is what [`examples/basic.svelte`](../examples/basic.svelte)
and the [quick start](../index.md#quick-start) render, and it is what
you should copy. Opting out is the deliberate choice; opting in is the
default.

```svelte
<ThemeSelect label="Theme" {themesUrl} {themes} bind:value={theme} />
<p class="theme-select-status" aria-live="polite">
  Active theme: {labelFor(theme)}
</p>
```

Why it is shaped this way:

- **`aria-live="polite"` announces mutations only.** It is silent on
  first paint and speaks once on each subsequent change — no
  announcement on page load, one clear announcement per user action.
- **Visible by default, not `sr-only`.** Sighted users and users who
  benefit from explicit confirmation of what just changed get the same
  information, and AAA favours showing it. If a design genuinely cannot
  spare the space, keep the element and the live region and hide it
  visually — see the recipe in [styling.md](./styling.md#the-status-line).
  Prefer visible.
- **`.theme-select-status` is the class hook** for the element, in the
  same kebab-case convention as the rest of the system.
- **Show the label, not the slug.** This package does not export its
  label function; mirror its default title-casing, or read from the same
  `themeLabels` map you pass to the select so the two cannot disagree.

Be clear-eyed about what this does and does not fix. It gives every
user a reliable statement of the active theme, and it announces
changes. It does **not** restore the combobox's own value semantics: a
user who tabs onto the control still hears "Theme, pop-up button,
Theme", and the open list still marks no option as selected. A user
navigating directly to the control without encountering the status
region will not learn the current theme from the control itself. That
residual gap is the price of the narrow control.

If your context needs the standard announce-the-selection behaviour
more than it needs the narrow control, use the `children` snippet to
render your own options and omit the placeholder — but note the
component still pins its own selection to the placeholder, so you would
be better served by the plain headless `ThemeSelect` container in
`lily-design-system-svelte-headless`.

## Screen-reader smoke test

- VoiceOver (macOS) announces the control as "{label}, pop-up button"
  and the placeholder as the current value.
- NVDA announces "{label} combo box" similarly.
- Selection changes are **not** announced via the control's value — see
  the tradeoff above. With the default status region in place, each
  change is announced from that live region instead.

## Common mistakes to avoid

- **Replacing the `<select>` with a div in custom-rendering.** The
  `children` snippet renders inside the `<select>`; do not wrap a div
  *around* the select if you need combobox semantics.
- **Hiding the `<select>` with `display: none`.** That removes it
  from the accessibility tree. Use a visually-hidden pattern
  (`clip-path: inset(50%)` or the `.sr-only` recipe) instead.
- **Forgetting to translate `themeLabels`.** The select only knows
  what the consumer tells it; locale-aware copy is the consumer's
  responsibility.

---

Lily™ and Lily Design System™ are trademarks.
