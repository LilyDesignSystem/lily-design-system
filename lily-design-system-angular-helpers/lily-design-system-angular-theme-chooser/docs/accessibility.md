# Accessibility

The select targets WCAG 2.2 AAA. It is an icon button that opens a
custom [WAI-ARIA APG listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/).

That sentence is the whole story: there is no native control
underneath. Every role, every state, every focus move, and every
keystroke in the tables below is code in this component rather than
behaviour supplied by the browser. That is a meaningful amount of
surface area to get wrong, and it is the frame for the tradeoffs
below.

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

`data-active` and `aria-selected` mean different things and are
usually on different options. `data-active` marks where the keyboard
is pointing right now; `aria-selected` marks the theme actually in
effect. Style both, and don't style them the same.

Element ids come from `nextThemeChooserId()`, an incrementing module
counter — deterministic, unique per instance, and identical across
server and client renders, so the `aria-controls` and
`aria-activedescendant` wiring survives hydration intact.

## Keyboard contract

Implemented by the component, following the APG listbox pattern.

On the **button**:

| Key                 | Action                                                                |
| ------------------- | --------------------------------------------------------------------- |
| `Tab`               | Move focus to the button (one stop).                                  |
| `Shift+Tab`         | Move focus away from the button.                                      |
| `Enter` / `Space`   | Open the listbox with the selected option active (index 0 if none).   |
| `Arrow Down`        | Same as `Enter` / `Space`.                                            |
| `Arrow Up`          | Open the listbox with the **last** option active.                     |

Opening always moves focus to the `<ul>`. The active option is
conveyed by `aria-activedescendant`; focus never lands on an `<li>`.

On the **listbox**:

| Key                | Action                                                                     |
| ------------------ | -------------------------------------------------------------------------- |
| `Arrow Down`       | Active option down one. **Clamps** at the last option — no wrap.            |
| `Arrow Up`         | Active option up one. **Clamps** at the first option — no wrap.             |
| `Home`             | First option becomes active.                                                |
| `End`              | Last option becomes active.                                                 |
| `Enter` / `Space`  | Select the active option, apply it, close, return focus to the button.      |
| `Escape`           | Close and return focus to the button; the value is **not** changed.         |
| `Tab`              | Close without stealing focus back; the browser moves focus onward.          |
| Printable chars    | Typeahead over the display **labels**; the buffer resets after 500 ms.      |

Pointer and focus behaviour:

- Clicking an option selects it, applies it, and closes the listbox.
- Clicking anywhere outside the root closes the listbox.
- Focus leaving the root closes the listbox.

The typeahead matches the rendered label, not the slug. With
`themeLabels` in play, typing `c` finds "Clair", not `light`.

## State signals

The active state is exposed in four independent channels — no
colour-only meaning is required:

1. `aria-selected="true"` on the chosen `<li role="option">`.
2. The hidden input's `value`.
3. `data-theme="<slug>"` on the target element (default `<html>`).
4. The `[(value)]` two-way binding (and the `themeChange` output).

## Tradeoffs

Three of them, stated plainly. None is fully solvable inside this
package; all three are things an adopter should decide about
knowingly.

### 1. The button is icon-only, so `aria-label` is load-bearing

The glyph is `aria-hidden="true"`, which means the button has no text
content whatsoever. `aria-label` is not a supplement to a visible
name — it is the *only* name the control has, in the accessibility
tree and in voice-control software alike.

The consequences of a weak label are concrete:

- A screen-reader user hears whatever you passed and nothing else.
  "Select", "Options", or "Button" leave them with no idea what the
  control does.
- A voice-control user (Dragon, Voice Control, Voice Access) says
  "click {label}" to activate it. If the label doesn't match what a
  person would naturally call the control, they cannot reach it by
  voice at all.
- No automated check catches this. axe will confirm an accessible
  name *exists*; it cannot tell you the name is useless.

`label` is `input.required<string>()` precisely because there is no
safe default. Name the setting — "Theme", "Colour theme",
"Appearance" — not the widget.

### 2. A custom listbox is weaker than a native `<select>`

This is a regression, not a neutral difference, and worth being blunt
about. A native `<select>` gets platform-native behaviour for free:
the OS picker on mobile, decades-hardened screen-reader support,
correct behaviour under browser zoom and forced-colours mode, and
keyboard conventions each platform's users already know. A custom
`role="listbox"` gets none of that. It gets whatever this component
implements, mediated by whatever the user's particular screen
reader / browser pairing does with ARIA.

In practice that means:

- **Support is less consistent.** `aria-activedescendant` is
  supported far less uniformly across screen readers than native
  `<select>` semantics. Announcements vary between VoiceOver, NVDA,
  and JAWS, and between browsers within each.
- **Mobile loses the native picker.** On iOS and Android a
  `<select>` opens the platform's own optimised, familiar chooser.
  This control renders an ordinary list instead.
- **Behaviours have to be re-earned.** Clamping vs. wrapping,
  typeahead timing, what `Escape` does — each is a decision this
  component made, and it is one implementation rather than the
  platform's.
- **Forced-colours and high-contrast modes** style native controls
  automatically. A `<div>`/`<ul>`/`<li>` tree does not; the consumer's
  CSS must handle `forced-colors: active` deliberately.

The compensation is that the pattern is implemented to the APG spec
and covered by tests (§7.14–§7.18 in
[`../spec/index.md`](../spec/index.md)). That reduces the risk; it
does not make the control equivalent to a native one. If your users
skew toward assistive technology and you do not need an icon-only
trigger, a plain `<select>` is the more robust choice, and choosing
it over this helper is a legitimate decision.

### 3. The glyph may not render

The default glyph is `◑` — U+25D1 CIRCLE WITH RIGHT HALF BLACK
(`&#9681;`). It is a Geometric Shapes character, not an emoji, and
its presence depends on the fonts installed on the user's device:

- It may render in a **different weight, size, or vertical
  alignment** than the surrounding text, because it likely comes from
  a fallback font rather than your body font.
- It may render as **tofu** (`□`) if no installed font covers the
  code point.
- Some platforms apply **emoji presentation** to nearby geometric
  characters, so it may arrive coloured and differently sized than
  intended.
- Under **forced-colours mode** or with **user font overrides** it
  may vanish or become illegible.

None of this affects the accessible name — the glyph is
`aria-hidden`, so screen-reader users are unaffected either way. It
affects sighted users, who may see an empty or broken button.

Two mitigations, both consumer-side:

- Set an explicit font stack on `.theme-chooser-icon` that you know
  covers U+25D1, and give the button a minimum size so an
  unrendered glyph still leaves a clickable, visible target.
- Or replace the glyph entirely with a projected `<ng-template>` —
  your own inline SVG, an icon font you control, or a text label.
  See [custom-rendering.md](./custom-rendering.md).

```html
<lily-theme-chooser label="Theme" [themesUrl]="url" [themes]="themes">
    <ng-template>
        <svg width="16" height="16" aria-hidden="true" focusable="false">…</svg>
    </ng-template>
</lily-theme-chooser>
```

## The status region is part of the pattern

The closed button shows a glyph and nothing else. It never displays
the active theme name — not visually, and not in the accessibility
tree, since its accessible name is the static `aria-label`. A user who
returns to the page has no way to learn which theme is in effect
without opening the listbox.

Because Lily targets WCAG 2.2 AAA, the compensation is **the default,
not a suggestion**. Every example in [`examples/`](../examples/) ships
it, the [quick start](../index.md#quick-start) opens with it, and it
is what an adopter copying this package gets unless they take it out.
Removing it is the deliberate choice; adding it is not.

The pattern: bind `[(value)]` and render a visible status line beside
the control.

```html
<lily-theme-chooser #themeChooser label="Theme" themesUrl="/t/"
                   [themes]="themes" [(value)]="theme" />

<p class="theme-chooser-status" aria-live="polite">
    Active theme: {{ themeChooser.labelFor(theme()) }}
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
  through the `#themeChooser` template reference, so the status text
  shows the same human label as the option ("Abyss", not `abyss`).
- **`theme-chooser-status`** is the class hook, kebab-case like the rest
  of the system. See [styling.md](./styling.md).

If a design truly cannot spare the space, keep the element and its
`aria-live` and hide it visually — the `.sr-only` recipe is in
[styling.md](./styling.md#visually-hidden-status-line). Dropping it
entirely puts the control back in the state described at the top of
this section.

### What this does and does not fix

Honest accounting. The status region gives the user a way to *learn*
the active theme, announced on every change. It does not repair the
tradeoffs above: the button still has no name beyond `aria-label`,
the listbox is still a custom widget with the support caveats in
tradeoff 2, and the glyph still renders however the platform's fonts
decide. Those are real, and they are the reason this page documents
them rather than declaring them solved.

## Internationalisation

- `label` is consumer-supplied; pass a translated string.
- `themeLabels` entries are consumer-supplied; localise the values.
  The typeahead matches these labels, so localising them localises
  the typeahead too.
- The component never emits hardcoded English (or any other natural
  language) strings, including the word "default".

## Visible focus

The component does not suppress `:focus` or `:focus-visible` styling.
Two elements take focus and both need a visible ring: the
`.theme-chooser-button`, and the `.theme-chooser-list` while open.
Because the `<ul>` holds focus for the whole open interaction, a
listbox with no focus indicator leaves a keyboard user with nothing on
screen tying the highlighted option to their keystrokes. Style
`.theme-chooser-list:focus-visible` and
`.theme-chooser-option[data-active]` together. See
[styling.md](./styling.md).

## Reduced motion

The component performs no animation. If you add an open/close
transition in your own CSS, gate it behind
`prefers-reduced-motion: no-preference`. Theme CSS files are
likewise responsible for respecting `prefers-reduced-motion` if they
introduce transitions on the `data-theme` swap.

## Screen-reader smoke test

- VoiceOver (macOS) and NVDA announce the closed control as
  "{label}, button, collapsed" (or "pop up button"). The active theme
  is **not** announced.
- Opening announces the listbox by its `aria-label`, then the active
  option as "{labelFor(slug)}, selected, N of M".
- Arrowing announces each newly-active option. This is the step where
  behaviour varies most between readers — test on the readers your
  users actually use rather than assuming parity with a native
  `<select>`.
- After closing, the control announces nothing about the new theme.
  The `theme-chooser-status` live region described above is what
  announces it — which is why that region is part of the default
  pattern.

## Common mistakes to avoid

- **Passing a vague `label`.** See tradeoff 1. This is the single
  most consequential mistake available on this component.
- **Hiding the root with `display: none`.** That removes the whole
  control from the accessibility tree. Use a visually-hidden pattern
  (`clip-path: inset(50%)` or the `.sr-only` recipe) instead.
- **Styling `[data-active]` as the selected state.** It is the
  keyboard highlight. `[aria-selected="true"]` is the chosen theme.
- **Leaving the listbox unpositioned.** With no CSS the list is in
  normal flow and shoves the page around when it opens. The package
  ships zero CSS; the positioning recipe is in
  [styling.md](./styling.md).
- **Forgetting to translate `themeLabels`.** The component only knows
  what the consumer tells it; locale-aware copy is the consumer's
  responsibility.
- **Binding `aria-label` via interpolation instead of `[attr.…]`.**
  `aria-label="{{ label() }}"` always emits the attribute (even as
  `""` or `"null"`); `[attr.aria-label]="label() || null"` removes
  it when empty. The component uses the latter.

## Angular-specific notes

### `[attr.aria-label]` vs `aria-label`

The component binds via `[attr.aria-label]="label() || null"` on both
the button and the listbox. The `null` sentinel removes the attribute
when the input is empty, matching DOM expectations. Don't bypass this
from a wrapper by overriding `aria-label="something"` statically.

### `host` bindings don't reach the inner elements

Angular forwards `class`, `style`, and `(event)` bindings declared
on the host element to the host node, not to the inner root `<div>`.
That means a consumer who writes
`<lily-theme-chooser class="my-extra">` ends up with `my-extra` on
the *host* node. To get a class hook on the root `<div>` itself, use
the `className` input.

### The projected template cannot change the ARIA contract

A projected `<ng-template>` replaces the button glyph only — never
the listbox, the options, or any ARIA attribute. Whatever you
project, the roles and states documented above still hold. One thing
to keep consistent: if you project text rather than a decorative
glyph, the button now has both text content and an `aria-label`.
`aria-label` wins in the accessibility tree, so make sure it agrees
with what is on screen (WCAG 2.5.3 Label in Name).

### `aria-current` is consumer-supplied

The helpers don't add `aria-current` automatically. When you build
a multi-item navigation that needs it, set it via your own wrapper.

## Testing for a11y

```ts
const fixture = mount({ label: "Theme", themesUrl: "/t/", themes: ["light", "dark"] });
const button = fixture.nativeElement.querySelector(".theme-chooser-button");
const list = fixture.nativeElement.querySelector(".theme-chooser-list");

expect(button.getAttribute("aria-label")).toBe("Theme");
expect(button.getAttribute("aria-haspopup")).toBe("listbox");
expect(button.getAttribute("aria-expanded")).toBe("false");
expect(button.getAttribute("aria-controls")).toBe(list.id);
expect(list.getAttribute("role")).toBe("listbox");
expect(list.hasAttribute("hidden")).toBe(true);
expect(fixture.nativeElement.querySelectorAll('[role="option"]').length).toBe(2);
```

For broader a11y testing run axe-core in a real Angular host. The
catalog has no built-in axe runner because the helpers ship no CSS
— a meaningful audit must run against the consumer's styled markup.
Remember that axe cannot evaluate whether your `label` is a *good*
name, nor how a given screen reader handles
`aria-activedescendant`; both need manual testing.

---

Lily™ and Lily Design System™ are trademarks.
