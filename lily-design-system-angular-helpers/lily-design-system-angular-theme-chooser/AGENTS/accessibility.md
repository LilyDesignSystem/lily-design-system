# Accessibility — ThemeChooser (Angular)

The select targets WCAG 2.2 AAA. It is an icon button that opens a
custom [WAI-ARIA APG listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/),
so **nothing comes free from the platform** — the component owns every
role, state, focus move, and key. This file is the Angular-flavoured
view of the contract; the canonical contract is in
[`../spec/index.md`](../spec/index.md) §6. The honest tradeoff
accounting is in [`../docs/accessibility.md`](../docs/accessibility.md).

## Roles and properties

| Element                 | Role / Property                                       | Source         |
| ----------------------- | ----------------------------------------------------- | -------------- |
| root `<div>`            | none — a container, not a control                     | —              |
| `<input type="hidden">` | `name`, `value` (form participation)                  | Component      |
| `<button>`              | implicit `role="button"`                              | Browser        |
| `<button>`              | `aria-label={label}` — its **entire** accessible name | Consumer input |
| `<button>`              | `aria-haspopup="listbox"`                             | Component      |
| `<button>`              | `aria-expanded="true|false"`                          | Component      |
| `<button>`              | `aria-controls={listId}`                              | Component      |
| `.theme-chooser-icon`    | `aria-hidden="true"`                                  | Component      |
| `<ul>`                  | `role="listbox"`, `aria-label={label}`, `tabindex="-1"` | Component    |
| `<ul>` (open only)      | `aria-activedescendant={active option id}`            | Component      |
| `<li>`                  | `role="option"`, `aria-selected="true|false"`         | Component      |
| `<li>`                  | `data-active` — styling hook, **not** ARIA            | Component      |

Because the glyph is `aria-hidden`, the button has no text content at
all. `aria-label` is the only thing a screen reader or a voice-control
user has to work with, which is why `label` is `input.required`.

## Keyboard contract

Implemented by the component. On the **button**:

| Key                 | Action                                                                |
| ------------------- | --------------------------------------------------------------------- |
| `Enter` / `Space`   | Open the listbox with the selected option active (index 0 if none).   |
| `Arrow Down`        | Same as `Enter` / `Space`.                                            |
| `Arrow Up`          | Open the listbox with the **last** option active.                     |
| `Tab` / `Shift+Tab` | Move focus to / away from the button.                                 |

Opening moves focus to the `<ul>`; the active option is conveyed by
`aria-activedescendant`, never by moving focus onto an `<li>`.

On the **listbox**:

| Key                | Action                                                                     |
| ------------------ | -------------------------------------------------------------------------- |
| `Arrow Down`       | Active option down one; **clamps** at the last — no wrap.                   |
| `Arrow Up`         | Active option up one; **clamps** at the first — no wrap.                    |
| `Home` / `End`     | First / last option becomes active.                                         |
| `Enter` / `Space`  | Select the active option, apply it, close, return focus to the button.      |
| `Escape`           | Close and return focus to the button; the value is **not** changed.         |
| `Tab`              | Close without stealing focus back; the browser moves focus onward.          |
| Printable chars    | Typeahead over the display labels; the buffer resets after 500 ms.          |

Pointer and focus:

- Clicking an option selects, applies, and closes.
- Clicking outside the root closes the listbox — wired as a
  `host: { "(document:click)": … }` binding.
- Focus leaving the root closes the listbox — a `(focusout)` binding
  on the root `<div>` that ignores moves to a descendant.

Both are Angular-managed bindings, so they tear down with the view.

## State signals

The active state is exposed in four independent channels — no
colour-only meaning is required:

1. `aria-selected="true"` on the chosen `<li role="option">`.
2. The hidden input's `value`.
3. `data-theme="<slug>"` on the target element (default `<html>`).
4. The `value` model signal (bound via `[(value)]`).

Note that the *closed* button conveys none of these — it shows only a
glyph. Surfacing the active theme name is the consumer's job; see
[`../docs/accessibility.md`](../docs/accessibility.md).

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

- VoiceOver (macOS) and NVDA announce the closed control as
  "{label}, button, collapsed" (or "pop up button"). The active theme
  is **not** announced — the button has no text beyond `aria-label`.
- Opening announces the listbox by its `aria-label` and then the
  active option as "{labelFor(slug)}, selected, N of M".
- Arrowing announces each newly-active option. Support for
  `aria-activedescendant` varies more between screen readers than
  native `<select>` support does; verify on the readers your users
  actually use.
- Selection changes are **not** announced by the control after it
  closes. Surface the active theme separately — see
  [`../docs/accessibility.md`](../docs/accessibility.md).

## Common mistakes to avoid

- **Passing a vague `label`.** "Select" or "Options" leaves an
  icon-only button with no usable name. Name the *setting*: "Theme",
  "Colour theme".
- **Hiding the root with `display: none`.** That removes the whole
  control from the accessibility tree. Use a visually-hidden pattern
  (`clip-path: inset(50%)` or the `.sr-only` recipe) instead.
- **Styling `[data-active]` as though it meant "selected".** It marks
  the keyboard's highlight, not the chosen theme. `[aria-selected="true"]`
  is the chosen theme, and the two are usually different options while
  the user is arrowing.
- **Forgetting to translate `themeLabels`.** The select only knows
  what the consumer tells it; locale-aware copy is the consumer's
  responsibility.
- **Binding `aria-label` via interpolation instead of `[attr.…]`.**
  `aria-label="{{ label() }}"` always emits the attribute (even as
  `""` or `"null"`); `[attr.aria-label]="label() || null"` removes
  it when empty. The select uses the latter.
- **Shipping no positioning CSS.** With no `position` rules the
  listbox displaces page content when it opens. The package ships zero
  CSS by design; see [`../docs/styling.md`](../docs/styling.md).

## Angular-specific notes

- The select is a standalone component; consumers add it via the
  `imports: [ThemeChooser]` array on their own standalone component
  rather than declaring it in an `NgModule`.
- `OnPush` change detection is in effect. Signal changes (input
  signals, model signals, the internal `effect()`) drive view
  updates without manual `markForCheck()`.
- A projected `<ng-template>` replaces the button glyph only. It
  cannot change the listbox markup, so the ARIA contract above holds
  whatever the consumer projects. If the projected content is text
  rather than a decorative glyph, the button then has both a text
  name and an `aria-label`; `aria-label` still wins, so keep them
  consistent.

## Testing for a11y

```ts
const fixture = mount({ label: "Theme", themesUrl: "/t/", themes: ["light", "dark"] });
const button = fixture.nativeElement.querySelector(".theme-chooser-button");
const list = fixture.nativeElement.querySelector(".theme-chooser-list");

expect(button.getAttribute("aria-label")).toBe("Theme");
expect(button.getAttribute("aria-haspopup")).toBe("listbox");
expect(button.getAttribute("aria-controls")).toBe(list.id);
expect(list.getAttribute("role")).toBe("listbox");
expect(list.hasAttribute("hidden")).toBe(true);
expect(fixture.nativeElement.querySelectorAll('[role="option"]').length).toBe(2);
```

For broader a11y testing run axe-core in a real Angular host. See
[`../../AGENTS/accessibility.md`](../../AGENTS/accessibility.md)
for the catalog-wide guidance.
