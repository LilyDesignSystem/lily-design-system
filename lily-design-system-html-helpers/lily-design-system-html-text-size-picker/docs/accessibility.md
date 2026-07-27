# Accessibility

The control targets WCAG 2.2 AAA and implements the WAI-ARIA APG
listbox pattern: an icon button that opens a dropdown
`role="listbox"`. It is not a native `<select>`, so none of the
keyboard behaviour comes from the platform — it is all implemented in
JavaScript, and documented in full below.

This helper also has a specific WCAG success criterion of its own —
1.4.4 Resize Text — which is the whole reason it exists. See
[WCAG 1.4.4 is this helper's job](#wcag-144-is-this-helpers-job).

## Roles and properties

| Element                                    | Role / Property                               | Source        |
| ------------------------------------------ | --------------------------------------------- | ------------- |
| `<text-size-chooser>` (host)                | none (transparent)                            | —             |
| `<div class="text-size-chooser">`           | none (styling root)                           | Element       |
| `<button class="text-size-chooser-button">` | implicit `role="button"`                      | Browser       |
| `<button>`                                 | `aria-label={label}`                          | Consumer attr |
| `<button>`                                 | `aria-haspopup="listbox"`                     | Element       |
| `<button>`                                 | `aria-expanded="true" \| "false"`             | Element       |
| `<button>`                                 | `aria-controls={listId}`                      | Element       |
| `<span class="text-size-chooser-icon">`     | `aria-hidden="true"`                          | Element       |
| `<ul class="text-size-chooser-list">`       | `role="listbox"`, `aria-label={label}`        | Element       |
| `<ul>`                                     | `tabindex="-1"`; `hidden` while closed        | Element       |
| `<ul>`                                     | `aria-activedescendant={optionId}` while open | Element       |
| `<li class="text-size-chooser-option">`     | `role="option"`, unique `id`, `aria-selected` | Element       |
| `<li>`                                     | `data-active` when keyboard-highlighted       | Element       |
| `<input type="hidden">`                    | none — form participation only                | Element       |

The host `<text-size-chooser>` element has no implicit ARIA role. It is
a lifecycle container that holds the rendered control.

### `data-active` is not `aria-selected`

They answer different questions and frequently disagree:

- `aria-selected="true"` — this is the **chosen** size, the one
  currently applied.
- `data-active` — this is the **keyboard-highlighted** option, the one
  `Enter` would choose. It exists only while the list is open.

Arrowing down from "Medium" to "Large" moves `data-active` to Large
while `aria-selected` stays on Medium until you press `Enter`. Style
them differently, or keyboard users cannot tell where they are from
what they have.

### Focus model

Focus moves to the `<ul>` when the list opens, and never lands on an
individual `<li>`. The highlighted option is conveyed solely through
`aria-activedescendant`, which is what the APG prescribes for a
listbox with a roving active descendant.

Two consequences for consumer CSS:

- Style `.text-size-chooser-list:focus-visible`, not just the button —
  that is where the focus ring belongs while the list is open.
- Give `.text-size-chooser-option[data-active]` a clearly visible
  highlight. Without it, a keyboard user gets no visual feedback at
  all as they arrow through the list, because focus is not moving.

## Keyboard contract

Implemented in JavaScript. Nothing here is inherited from the
platform.

### On the button

| Key         | Action                                                        |
| ----------- | ------------------------------------------------------------- |
| `Tab`       | Move focus onto the button.                                   |
| `Shift+Tab` | Move focus backwards off the button.                          |
| `ArrowDown` | Open the list with the selected option active (else index 0). |
| `Enter`     | Same as `ArrowDown`.                                          |
| `Space`     | Same as `ArrowDown`.                                          |
| `ArrowUp`   | Open the list with the **last** option active.                |

Opening always moves focus to the `<ul>`.

### On the listbox

| Key                 | Action                                                        |
| ------------------- | ------------------------------------------------------------- |
| `ArrowDown`         | Move the active option down one. **Clamps** at the last option — no wrapping. |
| `ArrowUp`           | Move the active option up one. Clamps at the first option.    |
| `Home`              | Make the first option active.                                 |
| `End`               | Make the last option active.                                  |
| `Enter`             | Select the active option, apply it, close, return focus to the button. |
| `Space`             | Same as `Enter`.                                              |
| `Escape`            | Close and return focus to the button, **without** changing the size. |
| `Tab`               | Close without stealing focus back; focus moves on normally.   |
| printable character | Typeahead over the option *labels*. The buffer resets after 500 ms of no typing; the search starts at the active option and wraps once. |

Arrow-key movement deliberately clamps rather than wraps. The APG
permits either; clamping means `End` and repeated `ArrowDown` agree,
and a user holding `ArrowDown` lands on the last option instead of
cycling past it.

### Pointer equivalents

- Clicking the button toggles the list.
- Clicking an option selects it, applies it, and closes.
- Clicking outside the rendered root closes the list.
- Focus leaving the root closes the list.

## State signals

The active state is exposed in four independent channels — no
colour-only meaning is required:

1. `aria-selected="true"` on one `<li role="option">`.
2. `data-text-size="<slug>"` on the target element (default `<html>`).
3. The `value` attribute / `el.value` property on the host.
4. The hidden `<input>`'s `value`, for form submission.

All four describe the *open* control or the document. The **closed**
button exposes none of them to a user: it shows a glyph and nothing
else.

## WCAG 1.4.4 is this helper's job

1.4.4 Resize Text requires text to be resizable up to 200% without
loss of content or functionality. Browser zoom technically satisfies
it, but an in-page control does better: it is discoverable, it
persists across visits, and it works in contexts where zoom is awkward
or unavailable — kiosks, embedded webviews, and the many users who do
not know the keyboard shortcut exists.

The helper records and applies the preference. **Meeting 1.4.4 is your
CSS.** To actually get there:

- **Size typography in relative units.** Set the scale once on the
  root and let `rem`/`em` carry it, so everything moves together:

  ```css
  :root[data-text-size="small"]   { font-size: 87.5%; }
  :root[data-text-size="medium"]  { font-size: 100%; }
  :root[data-text-size="large"]   { font-size: 125%; }
  :root[data-text-size="x-large"] { font-size: 150%; }
  ```

  A `px` font-size anywhere in the cascade opts that text out of the
  whole mechanism.

- **Offer a range reaching at least 200%** of your base size if this
  control is your 1.4.4 story rather than a supplement to zoom.

- **Verify the layout reflows instead of clipping** at the largest
  size. 1.4.10 (Reflow) and 1.4.12 (Text Spacing) are what break
  first: fixed-height containers, `overflow: hidden`, and single-line
  truncation all fail before the font size does.

- **Persist the choice** with `storage-key`, so a user who needs
  larger text sets it once rather than on every visit. This is a
  cognitive-accessibility win as much as a visual one.

## Known tradeoffs

The icon-button-plus-listbox design buys a compact, fully-styleable
control — and makes this helper structurally identical to its
`theme-chooser` and `locale-chooser` siblings. It costs three things,
and they are real. All three are the consumer's to mitigate.

### 1. It is an icon-only control

The accessible name depends **entirely** on `aria-label`, which comes
from the `label` attribute. There is no visible text label at all. Two
consequences:

- A consumer who passes a vague `label` leaves the control unusable to
  screen-reader users. "Text size" is fine; `""` or "Select" is not.
- The control **fails WCAG 2.5.3 Label in Name** unless the consumer
  adds a visible label of their own. 2.5.3 requires the accessible
  name to contain the visible label text; with no visible text there
  is nothing to match, and speech-input users have no word to say.

The fix is a visible label next to the control, or button content that
includes text via `renderButtonContent()`.

### 2. A custom listbox is weaker than a native `<select>`

The previous native `<select>` got a great deal for free, all of it
battle-tested in every assistive technology on every platform:
combobox semantics, the platform's own keyboard behaviour, the native
mobile OS picker, and typeahead.

A hand-rolled `role="listbox"` with `aria-activedescendant` is
well-specified by the APG, but:

- Screen-reader support for `aria-activedescendant` is weaker and more
  variable than support for native control semantics, particularly
  across older AT versions.
- Mobile browsers and mobile screen readers vary more.
- There is no native mobile picker UI — on a phone the user gets your
  CSS dropdown, not the OS wheel.

This is a genuine regression in robustness, accepted in exchange for a
control that can be styled and positioned freely. **A native
`<select>` remains the better choice for some audiences** — say so to
your own stakeholders rather than assuming the APG pattern is strictly
better. If your users skew toward mobile screen-reader users, weigh it
seriously.

It is worth noting this cost lands slightly harder here than on the
theme or locale siblings: a user who needs this control is, by
definition, a user with a visual or cognitive access need, and is
therefore likelier than average to be on assistive technology.

### 3. Glyph rendering is font-dependent

The button's glyph is a plain Unicode character with no bundled font,
because Lily ships no fonts or icon assets.

**"A" is materially safer than a pictograph on this point** — and that
is exactly why it was chosen. U+0041 LATIN CAPITAL LETTER A is ASCII;
it exists in every font ever shipped, it inherits the page's own
typeface, and it stays monochrome. It cannot render as tofu, and it
cannot turn into an unexpected colour emoji the way U+1F5DB DECREASE
FONT SIZE SYMBOL (which has no real glyph in common font stacks, and
means *decrease* rather than *size*) or theme-chooser's ◑ can.

The residual risk is stylistic, not legibility: "A" picks up whatever
typeface the button inherits, so it will look different across themes.
Consumers who need a guaranteed appearance override
`renderButtonContent()` with their own inline SVG.

## The status region is the default pattern

Because the closed button shows only a glyph, **the current text size
is not displayed or announced anywhere** unless you surface it.

So the control ships paired with a status region, and it is in the
`index.md` quick start, so the first thing an adopter copies already
has it. Leaving it out is the deliberate choice — a decision to make
knowingly, with a reason — not something to opt into later:

```html
<text-size-chooser label="Text size" sizes="small,medium,large,x-large"></text-size-chooser>

<p class="text-size-chooser-status" aria-live="polite">Text size: Medium</p>

<script type="module">
    await customElements.whenDefined("text-size-chooser");

    const select = document.querySelector("text-size-chooser");
    const status = document.querySelector(".text-size-chooser-status");

    select.addEventListener("textsizechange", (e) => {
        status.textContent = `Text size: ${select.labelFor(e.detail.size)}`;
    });
</script>
```

Why it is shaped this way:

- **Visible, not `sr-only`.** The gap is not screen-reader-only:
  nothing in the closed control indicates the active size to *anyone*.
  A visible line answers "what size am I on?" for sighted users and
  helps cognitive accessibility, which is what AAA favours.
- **`aria-live="polite"` announces mutations only**, so the region is
  silent on first paint and speaks once per change. No interruption,
  no page-load chatter.
- **Initial text authored in the markup**, not written by JS at
  startup — a startup write is a mutation, and mutations are what the
  live region announces. Under SSR/SSG, render it from the same
  resolved value you inline as the `value` attribute.
- **`labelFor()` is a public method on the element**, so the status
  line picks up `size-labels` overrides and translations for free and
  never shows a raw slug.

### What this does and does not fix

It restores the *information*, not the *semantics*. A screen-reader
user tabbing onto the closed button still hears only the label — "Text
size, pop-up button, collapsed" — and must read on to learn the active
value. That is a genuine residual cost of an icon-only trigger. If
your users depend on the control itself announcing its current value,
add visible button text via `renderButtonContent()`, which puts the
value back in the control.

## Common mistakes to avoid

- **Passing a vague `label`.** It is the entire accessible name of an
  icon-only button.
- **Not adding a visible label anywhere.** That is the WCAG 2.5.3
  failure described above.
- **Sizing type in `px`.** It opts that text out of the whole
  mechanism and quietly breaks 1.4.4.
- **Styling `[data-active]` and `[aria-selected]` identically.** They
  mean different things, and a keyboard user needs to see the
  difference.
- **Forgetting `.text-size-chooser-list:focus-visible`.** While the
  list is open the `<ul>` holds focus; if you only styled the button's
  focus ring, the focus indicator vanishes on open.
- **Hiding options with `display: none`.** That removes them from the
  accessibility tree. The element manages visibility with the `hidden`
  attribute on the list; leave the options alone.
- **Forgetting to translate `size-labels`.** The control only knows
  what the consumer tells it; locale-aware copy is the consumer's
  responsibility.
- **Wrapping the control in a Shadow DOM.** It uses light DOM; placing
  it inside a closed shadow root breaks `aria-labelledby` and
  `aria-controls` references from outside.

## Visible focus

The control does not suppress `:focus` or `:focus-visible` styling on
either the button or the list. The consumer's CSS is responsible for
the visible focus ring. NHS-UK and Lily™ themes ship a high-contrast
focus outline that meets AAA.

## Reduced motion

The control performs no animation — opening the list is a `hidden`
toggle, nothing more. If you add a transition to the dropdown, or to
the font-size change itself, gate it behind `prefers-reduced-motion`.
An animated type-scale change is exactly the kind of motion that
triggers vestibular symptoms.

## Screen-reader smoke test

- VoiceOver (macOS) announces the closed control as "{label}, pop-up
  button, collapsed". On open it reads the listbox's label, then each
  option as the active descendant moves.
- NVDA announces "{label} button collapsed", then "{label} list box"
  and the active option.
- Verify explicitly that the *closed* control conveys nothing about
  the active size — that is expected, and it is what the status region
  exists to cover.

## When subclassing

If you subclass `TextSizeChooser`, which tier you pick decides who owns
accessibility:

- **Overriding `renderButtonContent()` keeps the whole contract.** The
  base class still builds the button and listbox, so all the aria
  wiring and the entire keyboard contract keep working. Keep whatever
  you return `aria-hidden="true"` if it is decorative.
- **Replacing the rendered DOM transfers the contract to you** — every
  role, every id, every aria attribute, and every keyboard key,
  because the base class's handlers are bound to the DOM it built.

---

Lily™ and Lily Design System™ are trademarks.
