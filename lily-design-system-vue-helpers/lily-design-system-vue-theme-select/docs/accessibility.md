# Accessibility

The select targets WCAG 2.2 AAA and uses a native HTML `<select>`,
which carries the WAI-ARIA `combobox` semantics for free.

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

The active state is exposed in two independent channels — no
colour-only meaning is required:

1. `data-theme="<slug>"` on the target element (default `<html>`).
2. The `v-model:value` binding in user code.

Note that the `<select>`'s own selected `<option>` is **not** one of
these channels — see the tradeoff below.

## Tradeoff: the closed control does not announce the active theme

The `<select>` always displays its leading placeholder option
(`placeholder ?? label`); after every change the component snaps
`select.value` back to `""`. This keeps the control narrow and
predictable, but it has a real accessibility cost: **a screen-reader
user no longer hears the active theme announced as the combobox
value.** VoiceOver and NVDA read the placeholder word ("Theme"),
not "Dark". No option in the open list is marked selected either.

This is a genuine loss, and the compensation below does not fully
erase it: the value is still absent from the control itself, so a
user who tabs back to the select later and does not re-read the page
has no way to query the current theme from the widget. What the
status region does provide is an announcement at the moment of
change, and a persistent visible record of the active theme.

### The status region is the default pattern

Because of that cost, every example in this package pairs the select
with a status region, and so does the quick start in
[`index.md`](../index.md). **Shipping it is the default; removing it
is the deliberate choice** you make with your accessibility
reviewer — not something you opt into later.

```vue
<script setup lang="ts">
import { ref } from "vue";
import ThemeSelect from "../ThemeSelect.vue";

const theme = ref("");
const themeLabels = { light: "Light", dark: "Dark", abyss: "Abyss" };
</script>

<template>
    <ThemeSelect
        v-model:value="theme"
        label="Theme"
        themes-url="/assets/themes/"
        :themes="['light', 'dark', 'abyss']"
    />

    <p class="theme-select-status" aria-live="polite">
        Active theme: {{ themeLabels[theme] ?? theme }}
    </p>
</template>
```

Three decisions are baked into that snippet:

1. **Visible, not `sr-only`.** The active theme is invisible once the
   control snaps back to the placeholder, so a visible line helps
   sighted users and cognitive accessibility as well as screen-reader
   users — which is what WCAG AAA favours. If your design truly
   cannot spare the line, keep the element and apply the
   visually-hidden recipe in [`styling.md`](./styling.md); do not
   delete it.
2. **`aria-live="polite"`, not `role="alert"`.** A polite live region
   announces *mutations* only, so it is silent on first paint and
   speaks once per change, without moving focus. That matches WCAG
   3.2.2 (On Input): changing a setting must not change context.
3. **Human label, not the raw slug.** Show `labelFor(slug)` /
   `themeLabels[slug]` so the announcement reads "Active theme: Dark",
   not "Active theme: dark". All strings are consumer-supplied, so
   they localise with the rest of your copy.

Use the `.theme-select-status` class hook for the element — it is the
documented hook, listed in [`styling.md`](./styling.md).

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
  button" and each option as "{labelFor(slug)}, N of M".
- NVDA announces "{label} combo box" and each option similarly.
- The announced *value* of the closed control is always the
  placeholder text, never the active theme — by design, per the
  tradeoff above. The `.theme-select-status` live region shipped
  alongside the select is what announces the change; verify it fires
  once per change and stays silent on page load.

## Common mistakes to avoid

- **Replacing the `<select>` with a div in custom-rendering.** The
  default slot renders inside the `<select>`; don't wrap a div
  around the select if you need combobox semantics.
- **Hiding the `<select>` with `display: none`.** That removes it
  from the accessibility tree. Use a visually-hidden pattern
  (`clip-path: inset(50%)` or the `.sr-only` recipe) instead.
- **Forgetting to translate `themeLabels`.** The select only knows
  what the consumer tells it; locale-aware copy is the consumer's
  responsibility.
- **Setting `inheritAttrs: false` on a wrapping component.** Don't
  break the attribute fall-through; consumers rely on it for
  `data-testid`, `id`, and event handlers.
- **Dropping the `.theme-select-status` region to save space.** It is
  the only channel that announces the active theme. If space is the
  problem, hide it visually with the recipe in
  [`styling.md`](./styling.md) — that keeps the announcement.
- **Upgrading the status region to `role="alert"` or
  `aria-live="assertive"`.** That interrupts the user on every theme
  change. A theme switch is not an emergency; keep it polite.

---

Lily™ and Lily Design System™ are trademarks.
