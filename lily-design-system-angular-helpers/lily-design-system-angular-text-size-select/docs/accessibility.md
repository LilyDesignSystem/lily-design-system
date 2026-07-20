# Accessibility

The select targets WCAG 2.2 AAA. It is an icon button that opens a
custom [WAI-ARIA APG listbox](https://www.w3.org/WAI/ARIA/apg/patterns/listbox/).

That sentence is the whole story: there is no native control
underneath. Every role, every state, every focus move, and every
keystroke in the tables below is code in this component rather than
behaviour supplied by the browser. That is a meaningful amount of
surface area to get wrong, and it is the frame for the tradeoffs
below.

## Why this component exists: WCAG 1.4.4

This helper has a more direct accessibility purpose than its siblings.
Where `theme-select` and `locale-select` serve preference, this one
serves a specific success criterion.

- **1.4.4 Resize Text (AA)** requires text to be resizable to 200%
  without loss of content or functionality. Browser zoom satisfies
  the letter of it, but an in-page control that *remembers* the
  choice serves low-vision users far better than expecting them to
  re-zoom every site they visit.
- **1.4.12 Text Spacing (AA)** is adjacent: consumer CSS keyed on
  `[data-text-size]` can scale line-height, letter-spacing, and
  word-spacing alongside font-size rather than font-size alone.
- **1.4.10 Reflow (AA)** is the constraint on your CSS: at the
  largest size your layout must still reflow to a single column
  without a horizontal scrollbar. Test the largest slug at 320px
  wide.

The component only writes the attribute. Whether the result actually
meets 1.4.4 depends entirely on the CSS you map to it — so build the
scale with `rem` units off the root, and verify the largest step is a
real 200% rather than a token bump.

```css
:root[data-text-size="small"]   { font-size: 87.5%; }
:root[data-text-size="medium"]  { font-size: 100%; }
:root[data-text-size="large"]   { font-size: 150%; }
:root[data-text-size="x-large"] { font-size: 200%; }
```

## Roles and properties

| Element                  | Role / Property                                       | Source         |
| ------------------------ | ----------------------------------------------------- | -------------- |
| root `<div>`             | none — a container, not a control                     | —              |
| `<input type="hidden">`  | `name`, `value` (form participation)                  | Component      |
| `<button>`               | implicit `role="button"`                              | Browser        |
| `<button>`               | `aria-label={label}` — its **entire** accessible name | Consumer input |
| `<button>`               | `aria-haspopup="listbox"`                             | Component      |
| `<button>`               | `aria-expanded="true|false"`                          | Component      |
| `<button>`               | `aria-controls={listId}`                              | Component      |
| `.text-size-select-icon` | `aria-hidden="true"`                                  | Component      |
| `<ul>`                   | `role="listbox"`, `aria-label={label}`, `tabindex="-1"` | Component    |
| `<ul>` (open only)       | `aria-activedescendant={active option id}`            | Component      |
| `<li>`                   | `role="option"`, `aria-selected="true|false"`         | Component      |
| `<li>`                   | `data-active` — styling hook, **not** ARIA            | Component      |

`data-active` and `aria-selected` mean different things and are
usually on different options. `data-active` marks where the keyboard
is pointing right now; `aria-selected` marks the size actually in
effect. Style both, and don't style them the same.

Element ids come from `nextTextSizeSelectId()`, an incrementing module
counter — deterministic, unique per instance, and identical across
server and client renders, so the `aria-controls` and
`aria-activedescendant` wiring survives hydration intact.

## Keyboard contract

Implemented by the component, following the APG listbox pattern.

On the **button**:

| Key               | Action                                                              |
| ----------------- | ------------------------------------------------------------------- |
| `Tab`             | Move focus to the button (one stop).                                |
| `Shift+Tab`       | Move focus away from the button.                                    |
| `Enter` / `Space` | Open the listbox with the selected option active (index 0 if none). |
| `Arrow Down`      | Same as `Enter` / `Space`.                                          |
| `Arrow Up`        | Open the listbox with the **last** option active.                   |

Opening always moves focus to the `<ul>`. The active option is
conveyed by `aria-activedescendant`; focus never lands on an `<li>`.

On the **listbox**:

| Key               | Action                                                                |
| ----------------- | --------------------------------------------------------------------- |
| `Arrow Down`      | Active option down one. **Clamps** at the last option — no wrap.       |
| `Arrow Up`        | Active option up one. **Clamps** at the first option — no wrap.        |
| `Home`            | First option becomes active.                                           |
| `End`             | Last option becomes active.                                            |
| `Enter` / `Space` | Select the active option, apply it, close, return focus to the button. |
| `Escape`          | Close and return focus to the button; the value is **not** changed.    |
| `Tab`             | Close without stealing focus back; the browser moves focus onward.     |
| Printable chars   | Typeahead over the display **labels**; the buffer resets after 500 ms. |

Pointer and focus behaviour:

- Clicking an option selects it, applies it, and closes the listbox.
- Clicking anywhere outside the root closes the listbox.
- Focus leaving the root closes the listbox.

The typeahead matches the rendered label, not the slug. With
`sizeLabels` in play, typing `h` finds "Huge", not `x-large`.

## State signals

The active state is exposed in four independent channels — no
colour-only meaning is required:

1. `aria-selected="true"` on the chosen `<li role="option">`.
2. The hidden input's `value`.
3. `data-text-size="<slug>"` on the target element (default `<html>`).
4. The `[(value)]` two-way binding (and the `sizeChange` output).

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
safe default. Name the setting — "Text size", "Font size", "Reading
size" — not the widget.

There is a particular sting here. The users most likely to need this
control are low-vision users, who are also the users most likely to
be running a screen reader or magnifier. A vague label fails exactly
the audience the component was built for.

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
does not make the control equivalent to a native one. **A native
`<select>` remains the better choice for some audiences.** If your
users skew toward assistive technology and you do not need an
icon-only trigger, a plain `<select>` is the more robust control, and
choosing it over this helper is a legitimate decision. This helper
changed shape to match its two siblings — consistency across the
three preference controls — not because the listbox is
accessibility-superior.

There is also a bootstrapping wrinkle specific to this helper: the
control that fixes small text is itself rendered at the current text
size. Give `.text-size-select-button` a generous minimum target size
(WCAG 2.5.8 asks for 24×24 CSS px; AAA 2.5.5 asks for 44×44) that
does not shrink with the smallest slug.

### 3. The glyph may not render

The default glyph is `"A"` — U+0041 LATIN CAPITAL LETTER A. This is
**materially safer than a pictograph**, and deliberately so.

The obvious candidate was U+1F5DB DECREASE FONT SIZE SYMBOL. It was
rejected on two counts: it has no real glyph in common font stacks
and falls back to a crude bitmap shape or tofu, and it means
*decrease* rather than *size*, which is the wrong idea for a control
that also increases. A plain Latin capital A is covered by every font
that can render the surrounding page, arrives in the page's own
typeface at the page's own weight, stays monochrome, and is the
conventional text-size affordance across operating systems and
browsers.

So the failure modes that afflict theme-select's `◑` largely do not
apply here. What remains:

- Under **forced-colours mode** or with **user font overrides** the
  letter follows the user's chosen colours — which is correct
  behaviour, not a defect, but it may not match your design.
- With a decorative or icon-only `font-family` on the button, "A"
  could render as something unexpected. Don't set one.
- The letter carries no *scale* information on its own. Many
  implementations pair a small A with a large A, or add a visible
  text label, to communicate "size" rather than "letter". Consider
  whether the glyph alone reads as the right affordance in your UI.

None of this affects the accessible name — the glyph is
`aria-hidden`, so screen-reader users are unaffected either way. It
affects sighted users.

Two mitigations, both consumer-side:

- Give the button a minimum size and a clear focus/hover treatment so
  the target is unambiguous regardless of the glyph.
- Or replace the glyph entirely with a projected `<ng-template>` —
  your own inline SVG, a paired small-A/large-A treatment, or a text
  label.

```html
<lily-text-size-select label="Text size" [sizes]="sizes">
    <ng-template lilyTextSizeSelectIcon>
        <svg width="16" height="16" aria-hidden="true" focusable="false">…</svg>
    </ng-template>
</lily-text-size-select>
```

## The status region is part of the pattern

The closed button shows a glyph and nothing else. It never displays
the active size name — not visually, and not in the accessibility
tree, since its accessible name is the static `aria-label`. A user who
returns to the page has no way to learn which size is in effect
without opening the listbox.

Because Lily targets WCAG 2.2 AAA, the compensation is **the default,
not a suggestion**. Removing it is the deliberate choice; adding it is
not.

The pattern: bind `[(value)]` and render a visible status line beside
the control.

```html
<lily-text-size-select #sizeSelect label="Text size"
                       [sizes]="sizes" [(value)]="size" />

<p class="text-size-select-status" aria-live="polite">
    Text size: {{ sizeSelect.labelFor(size()) }}
</p>
```

Why each part is the way it is:

- **Visible, not `sr-only`.** Naming the current setting in plain text
  serves sighted, low-vision, and cognitively-impaired users as well as
  screen-reader users, and it needs no live-region timing care. AAA
  favours the visible form. For this helper especially: the status
  line is itself rendered at the chosen size, so it doubles as an
  immediate preview of the choice.
- **`aria-live="polite"` announces mutations only.** The region is
  silent on first paint and speaks once on each subsequent change — a
  confirmation per switch, not a greeting on load. Do not use
  `assertive`; a size change is not an interruption.
- **`labelFor()`** is the component's own label resolver, reached
  through the `#sizeSelect` template reference, so the status text
  shows the same human label as the option ("X Large", not
  `x-large`).
- **`text-size-select-status`** is the class hook, kebab-case like the
  rest of the system.

### What this does and does not fix

Honest accounting. The status region gives the user a way to *learn*
the active size, announced on every change. It does not repair the
tradeoffs above: the button still has no name beyond `aria-label`,
and the listbox is still a custom widget with the support caveats in
tradeoff 2. Those are real, and they are the reason this page
documents them rather than declaring them solved.

## Internationalisation

- `label` is consumer-supplied; pass a translated string.
- `sizeLabels` entries are consumer-supplied; localise the values.
  The typeahead matches these labels, so localising them localises
  the typeahead too.
- The component never emits hardcoded English (or any other natural
  language) strings.
- Note that the "A" glyph is a Latin letter. In a non-Latin-script
  UI it may read as decorative or foreign rather than as "text
  size"; project a script-appropriate glyph or a text label instead.

## Visible focus

The component does not suppress `:focus` or `:focus-visible` styling.
Two elements take focus and both need a visible ring: the
`.text-size-select-button`, and the `.text-size-select-list` while
open. Because the `<ul>` holds focus for the whole open interaction, a
listbox with no focus indicator leaves a keyboard user with nothing on
screen tying the highlighted option to their keystrokes. Style
`.text-size-select-list:focus-visible` and
`.text-size-select-option[data-active]` together.

## Reduced motion

The component performs no animation. If you add an open/close
transition in your own CSS, gate it behind
`prefers-reduced-motion: no-preference`. The same applies to any
transition on the `font-size` change itself — animating text size is
a strong motion trigger for some users, so prefer an instant swap.

## Screen-reader smoke test

- VoiceOver (macOS) and NVDA announce the closed control as
  "{label}, button, collapsed" (or "pop up button"). The active size
  is **not** announced.
- Opening announces the listbox by its `aria-label`, then the active
  option as "{labelFor(slug)}, selected, N of M".
- Arrowing announces each newly-active option. This is the step where
  behaviour varies most between readers — test on the readers your
  users actually use rather than assuming parity with a native
  `<select>`.
- After closing, the control announces nothing about the new size.
  The `text-size-select-status` live region described above is what
  announces it — which is why that region is part of the default
  pattern.

## Common mistakes to avoid

- **Passing a vague `label`.** See tradeoff 1. This is the single
  most consequential mistake available on this component.
- **Mapping the slugs to a scale that never reaches 200%.** Then the
  control looks like it serves 1.4.4 without actually doing so.
- **Setting `font-size` in `px` on descendants.** That defeats the
  root-relative scale; use `rem` throughout.
- **Hiding the root with `display: none`.** That removes the whole
  control from the accessibility tree. Use a visually-hidden pattern
  (`clip-path: inset(50%)`) instead.
- **Styling `[data-active]` as the selected state.** It is the
  keyboard highlight. `[aria-selected="true"]` is the chosen size.
- **Leaving the listbox unpositioned.** With no CSS the list is in
  normal flow and shoves the page around when it opens. The package
  ships zero CSS.
- **Letting the button shrink with the smallest size slug.** The
  control must stay comfortably hittable at every size it can set.
- **Forgetting to translate `sizeLabels`.** The component only knows
  what the consumer tells it.

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
`<lily-text-size-select class="my-extra">` ends up with `my-extra` on
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

## Testing for a11y

```ts
const fixture = mount({ label: "Text size", sizes: ["small", "medium"] });
const button = fixture.nativeElement.querySelector(".text-size-select-button");
const list = fixture.nativeElement.querySelector(".text-size-select-list");

expect(button.getAttribute("aria-label")).toBe("Text size");
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
name, whether your size scale actually reaches 200%, nor how a given
screen reader handles `aria-activedescendant`; all three need manual
testing.

---

Lily™ and Lily Design System™ are trademarks.
