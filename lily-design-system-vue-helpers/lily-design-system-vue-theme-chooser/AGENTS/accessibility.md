# Accessibility — ThemeChooser (Vue)

The chooser targets WCAG 2.2 AAA. It is an icon button that opens a
WAI-ARIA APG listbox — the roles, properties, focus management, and
keyboard contract are all implemented by the component, not inherited
from a native `<select>`. This file is the Vue-flavoured view; the
canonical contract is in [`../spec/index.md`](../spec/index.md) §6, and
the consumer-facing tradeoff discussion is in
[`../docs/accessibility.md`](../docs/accessibility.md).

## Roles and properties

| Element                  | Role / Property                               | Source        |
| ------------------------ | --------------------------------------------- | ------------- |
| root `<div>`             | none — plain wrapper, receives `$attrs`       | Component     |
| `<input type="hidden">`  | `name` — form participation only              | Component     |
| `<button>`               | implicit `role="button"`                      | Browser       |
| `<button>`               | `aria-label={label}`                          | Consumer prop |
| `<button>`               | `aria-haspopup="listbox"`                     | Component     |
| `<button>`               | `aria-expanded` — `"true"` / `"false"`        | Component     |
| `<button>`               | `aria-controls={listId}`                      | Component     |
| `.theme-chooser-icon`     | `aria-hidden="true"`                          | Component     |
| `<ul>`                   | `role="listbox"`, `aria-label={label}`        | Component     |
| `<ul>`                   | `tabindex="-1"`, `hidden` while closed        | Component     |
| `<ul>`                   | `aria-activedescendant` — only while open     | Component     |
| `<li>`                   | `role="option"`, `aria-selected`              | Component     |
| `<li>`                   | `data-active` on the keyboard-active option   | Component     |

Focus stays on the `<ul>` for as long as the listbox is open; the
active option is conveyed with `aria-activedescendant`. The `<li>`
elements are never focused and never tab stops.

`aria-selected` is the committed selection (for assistive technology);
`data-active` is the keyboard-active option (for consumer CSS). They
move independently — do not conflate them.

## Keyboard contract

Component-implemented. Focus moves to the `<ul>` on open and returns to
the button on commit or cancel.

On the **button**:

| Key                  | Action                                                         |
| -------------------- | -------------------------------------------------------------- |
| `Tab` / `Shift+Tab`  | Move focus to / away from the button (native, one stop).       |
| `ArrowDown`          | Open, active option = the selected one (or index 0).           |
| `Enter` / `Space`    | Open, active option = the selected one (or index 0).           |
| `ArrowUp`            | Open, active option = the **last** option.                     |

On the **listbox**:

| Key                  | Action                                                         |
| -------------------- | -------------------------------------------------------------- |
| `ArrowDown`          | Move the active option down one. **Clamps** — no wrapping.     |
| `ArrowUp`            | Move the active option up one. **Clamps** — no wrapping.       |
| `Home` / `End`       | Jump to the first / last option.                               |
| `Enter` / `Space`    | Select the active option, apply it, close, refocus the button. |
| `Escape`             | Close and refocus the button **without** changing the value.   |
| `Tab`                | Close without stealing focus back.                             |
| Printable characters | Typeahead over the option **labels**, 500 ms buffer reset.     |

Pointer and focus: clicking an option selects it; clicking outside the
root closes the listbox; focus leaving the root closes it. Both of
those close *without* refocusing the button, so the user's own focus
movement is never fought.

## State signals

The active theme is exposed in three independent channels — no
colour-only meaning is required:

1. `data-theme="<slug>"` on the target element (default `<html>`).
2. The `value` prop (bound via `v-model:value`).
3. The hidden input's `value`, for form submission.

The closed control is **not** one of them: it is icon-only, so it shows
and announces nothing about the active theme. That is the reason the
documented pattern pairs the chooser with a `.theme-chooser-status` live
region — see [`../docs/accessibility.md`](../docs/accessibility.md).

## The three tradeoffs

Summarised here; argued in full in
[`../docs/accessibility.md`](../docs/accessibility.md).

1. **Icon-only.** `aria-label` from `label` is the button's entire
   accessible name. A wrong or untranslated `label` leaves the control
   unnamed, and WCAG 2.5.3 (Label in Name) has no visible text to match
   against.
2. **A custom listbox is less robust than a native `<select>`.** No
   platform-native AT behaviour, no OS mobile picker, and uneven
   real-world `aria-activedescendant` / forms-mode support. APG
   conformance is not the same as decades of platform testing.
3. **The `◑` glyph is font-dependent.** It may be re-weighted,
   substituted, or missing (tofu). Consumers who care should ship an
   SVG through the default slot.

## Internationalisation

- `label` is consumer-supplied; pass a translated string. It is the
  only name the button has.
- `themeLabels` entries are consumer-supplied; localise the values.
  Typeahead matches against them, so localising them localises the
  typeahead.
- The component never emits hardcoded English (or any other natural
  language) strings, including the word "default".

## Visible focus

The component suppresses no focus styling. Two elements take focus and
both need an indicator: `.theme-chooser-button`, and `.theme-chooser-list`
while open. Style the active option from `[data-active]` — with focus
on the `<ul>`, that is the only cue a sighted keyboard user gets.

## Reduced motion

The component performs no animation. Theme CSS files are responsible
for respecting `prefers-reduced-motion` if they introduce transitions
on the `data-theme` swap.

## Screen-reader smoke test

Required, not optional — this is a scripted widget:

- VoiceOver (macOS) announces the trigger as "{label}, pop-up button,
  collapsed"; on open, the active option as "{labelFor(slug)}, N of M".
- NVDA announces "{label} button, collapsed" and the active option on
  open; verify arrowing announces each newly-active option.
- JAWS — check the forms-mode handover: confirm arrow keys reach the
  component rather than moving the virtual cursor.
- Mobile VoiceOver / TalkBack — there is no native picker, so confirm
  options are swipe-reachable and double-tap-activatable.

## Common mistakes to avoid

- **Rendering interactive or text-bearing markup in the default slot.**
  It lands inside the `<button>`: nested buttons are invalid, and
  visible text competes with `aria-label`.
- **Styling `[aria-selected]` but not `[data-active]`.** Keyboard
  navigation then looks inert.
- **Adding `tabindex` to the `<li>` options.** They are
  `aria-activedescendant` targets, not tab stops.
- **Hiding the button with `display: none`.** That removes it from the
  accessibility tree. Use `clip-path: inset(50%)` or an `.sr-only`
  recipe.
- **Forgetting to translate `themeLabels`.** The component only knows
  what the consumer tells it.
- **Setting `inheritAttrs: false`.** Don't. Vue's default attribute
  fall-through is part of the contract; turning it off breaks
  `data-testid`, `id`, and event handler pass-through.

## Vue-specific notes

- `aria-label` is bound via `:aria-label="label"` on the button and the
  listbox. `$attrs` falls through to the root `<div>`, so a consumer
  passing a bare `aria-label` attribute names the **wrapper**, not the
  button — the `label` prop is the only way to name the control.
- A default slot replaces the glyph only. The button, its
  `aria-label`, the listbox, and the options are unaffected.
- Vue's reactivity does not affect ARIA announcements. The browser
  announces what's in the DOM; making sure the DOM is correct is
  enough.

## Testing for a11y

```ts
const wrapper = mount(ThemeChooser, {
    props: { label: "Theme", themesUrl: "/t/", themes: ["light", "dark"] },
});
const button = wrapper.find("button.theme-chooser-button");
expect(button.attributes("aria-label")).toBe("Theme");
expect(button.attributes("aria-haspopup")).toBe("listbox");
expect(button.attributes("aria-expanded")).toBe("false");
expect(wrapper.find("ul.theme-chooser-list").attributes("aria-label")).toBe("Theme");
expect(wrapper.findAll("li.theme-chooser-option")).toHaveLength(2);
```

For broader a11y testing run axe-core in a real Vue host. See
[`../../AGENTS/accessibility.md`](../../AGENTS/accessibility.md)
for the catalog-wide guidance.
