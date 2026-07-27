# Accessibility

The chooser targets WCAG 2.2 AAA. It is an icon button that opens a
WAI-ARIA APG listbox: the roles, the properties, the focus management,
and the whole keyboard contract are implemented by the component rather
than inherited from a native `<select>`.

That is a deliberate trade, and it is not free. This page documents
what the component gives you, what it costs, and the pattern that
compensates.

## This helper's specific concern: WCAG 1.4.4 (Resize Text)

Every other page in this catalog treats accessibility as a constraint.
Here it is the **product**. Success criterion 1.4.4 (Resize Text, AA)
asks that text can be resized up to 200% without loss of content or
functionality; 1.4.12 (Text Spacing, AA) asks that content survives
increased spacing. Browser zoom satisfies 1.4.4 on its own — this
helper is not a substitute for it, and you should never disable zoom
on the theory that you have shipped a size control instead.

What the control adds is a **persistent, in-app, text-only** size
change, which matters for users that browser zoom serves poorly:

- Zoom scales layout as well as text, so a low-vision user on a narrow
  viewport trades reading size against reflow. A `font-size` change on
  `<html>` scales type while your `rem`-based layout adapts.
- Zoom is per-origin browser state a user must re-apply on a new
  device; `storageKey` persistence keeps the choice with the app, and
  a server-rendered `value` keeps it flicker-free.
- Zoom is invisible to your CSS. `[data-text-size]` is a hook you can
  use to adjust line-height, spacing, or truncation at larger sizes.

Two obligations come with shipping it:

1. **Size your CSS in relative units.** The helper sets an attribute
   and nothing else. If your typography is in `px`, `data-text-size`
   changes nothing and the control is a lie. Use `rem` / `em`, and
   set the scale on `:root[data-text-size="…"]` as in
   [`../index.md`](../index.md).
2. **Test your layout at the largest size.** The point of 1.4.4 is
   *without loss of content or functionality*. Check your top size for
   clipped text, overlapping controls, and truncation with an ellipsis
   — and check it in combination with 200% browser zoom, because users
   will use both at once.

## Roles and properties

| Element                    | Role / Property                              | Source        |
| -------------------------- | -------------------------------------------- | ------------- |
| root `<div>`               | none (a plain grouping wrapper)              | Component     |
| `<input type="hidden">`    | `name` — form participation only             | Component     |
| `<button>`                 | implicit `role="button"`                     | Browser       |
| `<button>`                 | `aria-label={label}`                         | Consumer prop |
| `<button>`                 | `aria-haspopup="listbox"`                    | Component     |
| `<button>`                 | `aria-expanded` — `"true"` / `"false"`       | Component     |
| `<button>`                 | `aria-controls={listId}`                     | Component     |
| `<span class="text-size-chooser-icon">` | `aria-hidden="true"`             | Component     |
| `<ul>`                     | `role="listbox"`, `aria-label={label}`       | Component     |
| `<ul>`                     | `tabindex="-1"`, `hidden` while closed       | Component     |
| `<ul>`                     | `aria-activedescendant` — **only while open** | Component     |
| `<li>`                     | `role="option"`, `aria-selected`             | Component     |
| `<li>`                     | `data-active` on the keyboard-active option  | Component     |

Focus stays on the `<ul>` for the whole time the listbox is open; the
active option is conveyed to assistive technology with
`aria-activedescendant`, per the APG listbox pattern. The `<li>`
elements are never focused and are never tab stops.

Two channels carry two different meanings, and they are not
interchangeable: `aria-selected` is the **committed** selection, for
assistive technology; `data-active` is the **keyboard-active** option,
for consumer CSS. Do not style from `aria-selected` alone — while the
user is arrowing through the list, the selection has not changed yet.

## Keyboard contract

Implemented by the component. Focus moves to the `<ul>` on open and
returns to the button on commit or cancel.

On the **button**:

| Key                  | Action                                                         |
| -------------------- | -------------------------------------------------------------- |
| `Tab` / `Shift+Tab`  | Move focus to / away from the button (native, one stop).       |
| `ArrowDown`          | Open, active option = the selected one (or the first).         |
| `Enter` / `Space`    | Open, active option = the selected one (or the first).         |
| `ArrowUp`            | Open, active option = the **last** option.                     |

On the **listbox**:

| Key                  | Action                                                         |
| -------------------- | -------------------------------------------------------------- |
| `ArrowDown`          | Move the active option down one. **Clamps** — no wrapping.     |
| `ArrowUp`            | Move the active option up one. **Clamps** — no wrapping.       |
| `Home` / `End`       | Jump to the first / last option.                               |
| `Enter` / `Space`    | Select the active option, apply it, close, refocus the button. |
| `Escape`             | Close and refocus the button **without** changing the value.   |
| `Tab`                | Close without stealing focus back; focus moves on normally.    |
| Printable characters | Typeahead over the option **labels**; the buffer resets after 500 ms. |

Clamping rather than wrapping is intentional: it matches the APG
listbox, and on an ordered scale like text size it also preserves the
mental model — `End` then `ArrowDown` should stay at the largest size,
not silently jump back to the smallest.

Pointer and focus behaviour: clicking an option selects and applies it;
clicking the button again closes the listbox; clicking outside the root
closes it; focus leaving the root closes it. Closing by click-outside
or by `Tab` does **not** pull focus back to the button, so the user's
own focus movement is never fought.

## State signals

The active size is exposed in three independent channels — no
colour-only meaning is required:

1. `data-text-size="<slug>"` on the target element (default `<html>`).
2. The `v-model:value` binding in user code.
3. The hidden input's `value`, for plain form submission.

Note what is *not* on that list: the closed control's visible surface.
That is the first of three tradeoffs below.

## Tradeoff 1: the control is icon-only

The button renders a glyph and nothing else. Its entire accessible
name is `aria-label`, taken from the `label` prop.

That has consequences worth stating plainly:

- **A wrong, missing, or untranslated `label` leaves the control
  unnamed.** There is no visible text to fall back to, so a screen
  reader announces something like "button" and the user has no way to
  learn what it does. `label` is a required prop for exactly this
  reason — treat it as load-bearing copy, not decoration, and put it
  through the same translation pipeline as the rest of your strings.
- **WCAG 2.5.3 (Label in Name) has nothing to match against.** That
  success criterion asks that a control's accessible name contain its
  visible text label. With no visible text there is no mismatch to
  create — but there is also no help for a speech-input user trying to
  say the control's name aloud. If your audience includes speech-input
  users, prefer the visible-text variant below.
- **A visible-text variant is possible via the slot**, but the slot
  content must stay `aria-hidden="true"` so it does not compete with
  `aria-label`. Vue offers no way to have slot content *become* the
  accessible name here; `aria-label` on the button always wins, and two
  competing names is worse than one clear one. If you render visible
  text in the slot, make sure `label` says the same thing.

There is a specific irony to weigh on this helper: the users most
likely to need a text-size control are the users least well served by
a small icon-only target. Give the button a generous hit area (at
least 44×44 CSS px, WCAG 2.5.5 Target Size AAA) and consider the
visible-text variant here more seriously than you would on
`theme-chooser`.

## Tradeoff 2: a custom listbox is less robust than a native `<select>`

This is the honest cost of the rewrite, and it should be weighed
before adopting.

A native `<select>` gets you, for free and with no script:

- Platform-native screen reader behaviour that has been tested against
  every AT / browser / OS combination for two decades.
- The **OS picker** on touch devices — the iOS wheel, the Android
  dialog — which is large, familiar, and works with platform assistive
  technology including switch control and voice control.
- Correct forms-mode / browse-mode handover in JAWS and NVDA, without
  the component knowing those modes exist.
- **Sizing from the user's own OS text-size setting**, which a styled
  `<ul>` does not inherit.

A `role="listbox"` + `aria-activedescendant` widget re-implements all
of that in script. This implementation is APG-conformant and
keyboard-complete — every key in the table above is covered by a test —
but conformance and coverage are not the same thing:

- **Real-world screen reader coverage is less uniform.**
  `aria-activedescendant` is well-supported in principle and unevenly
  supported in practice; announcements of the active option vary by AT
  and version.
- **Forms mode / browse mode interactions vary.** A virtual-cursor user
  may need to enter forms mode before the arrow keys reach the
  component at all, and whether that happens automatically depends on
  the AT.
- **There is no native mobile picker.** On a phone the listbox is a
  small styled list rather than the OS control the user expects.

What is bought with that: a compact control that does not grow to fit
the longest size name, renders identically across browsers, can be
styled completely, and is consistent with the other two helpers.
Whether that is a good trade is a decision for your accessibility
reviewer, not a foregone conclusion. **If your product's priority is
maximal AT robustness over visual control, a native `<select>` remains
the more conservative choice** — and that goes double for a text-size
control, whose audience skews toward assistive-technology users by
definition. The headless catalog entry
(`lily-design-system-vue-headless/components/TextSizeChooser/`) is still
a plain `<select>` container if you want it.

Test the real thing. See the screen-reader smoke test below.

## Tradeoff 3: the glyph is font-dependent

The default button content is `A` (U+0041 LATIN CAPITAL LETTER A),
exported as `LATIN_CAPITAL_LETTER_A`. It is a text character rendered
from the user's installed fonts, so it may render with different
weight, size, or baseline alignment than you expect.

**This is materially safer than a pictograph**, and that is why the
letter was chosen. The obvious candidate — U+1F5DB DECREASE FONT SIZE
SYMBOL — fails on two counts: it has no real glyph in common font
stacks and degrades to a crude bitmap shape or tofu (`□`), and it
means *decrease* rather than *size*, which is the wrong affordance for
a control that also makes text bigger. `A` is present in every font
that can render your page at all — if it were missing, your body copy
would be broken too — it renders in the page's own face rather than a
fallback, it stays monochrome like `theme-chooser`'s `◑`, and it is the
conventional text-size affordance across operating systems.

Residual risks are cosmetic rather than structural:

- The letter inherits your `font-family`, so it will look different in
  a serif page than a sans one. That is usually desirable.
- It carries no intrinsic "size" meaning on its own. The conventional
  form pairs two sizes of the letter (a small A and a large A), which
  the slot lets you draw.

None of this breaks the accessible name — the glyph is
`aria-hidden="true"` and the name comes from `label`.

**If you want the conventional two-size affordance, ship your own SVG
through the default slot.** An inline SVG renders identically
everywhere and can inherit `currentColor`:

```vue
<TextSizeChooser
    label="Text size"
    :sizes="['small', 'medium', 'large', 'x-large']"
    v-model:value="size"
>
    <template #default="{ open }">
        <svg
            class="text-size-chooser-icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
            focusable="false"
            :data-open="open ? '' : undefined"
        >
            <text x="1" y="13" font-size="8" fill="currentColor">A</text>
            <text x="7" y="13" font-size="13" fill="currentColor">A</text>
        </svg>
    </template>
</TextSizeChooser>
```

Keep `aria-hidden="true"` and `focusable="false"` on the SVG: the
first stops it competing with `aria-label`, the second stops legacy
Internet Explorer / Edge behaviour from making it a tab stop.

## The status region is the default pattern

Pair the chooser with a status region. **Shipping it is the default;
removing it is the deliberate choice** you make with your
accessibility reviewer — not something you opt into later.

The control is icon-only, so it announces **nothing at all** about the
active size: the closed button shows a glyph, its accessible name is
the static `label`, and the active slug appears only in
`data-text-size` and in your binding. There is no on-screen and no
announced representation of which size is active unless you render
one.

```vue
<script setup lang="ts">
import { ref } from "vue";
import TextSizeChooser from "../TextSizeChooser.vue";

const size = ref("");
const sizeLabels = { small: "Small", medium: "Medium", large: "Large", "x-large": "X Large" };
</script>

<template>
    <TextSizeChooser
        v-model:value="size"
        label="Text size"
        :sizes="['small', 'medium', 'large', 'x-large']"
        storage-key="lily-text-size"
    />

    <p class="text-size-chooser-status" aria-live="polite">
        Text size: {{ sizeLabels[size] ?? size }}
    </p>
</template>
```

Three decisions are baked into that snippet:

1. **Visible, not `sr-only`.** The active size is invisible in an
   icon-only control, so a visible line helps sighted users and
   cognitive accessibility as well as screen-reader users — which is
   what WCAG AAA favours. It has a bonus here that it does not have on
   the other helpers: the status text is itself rendered at the
   selected size, so it doubles as a live preview.
2. **`aria-live="polite"`, not `role="alert"`.** A polite live region
   announces *mutations* only, so it is silent on first paint and
   speaks once per change, without moving focus. That matters here:
   focus is being managed already (it returns to the button on commit),
   and a region that stole it would fight the component. It also
   matches WCAG 3.2.2 (On Input): changing a setting must not change
   context.
3. **Human label, not the raw slug.** Show `labelFor(slug)` /
   `sizeLabels[slug]` so the announcement reads "Text size: X Large",
   not "Text size: x-large". All strings are consumer-supplied, so
   they localise with the rest of your copy.

Be clear about what this does and does not fix. It announces the
*transition* and leaves a persistent visible record. It does not put
the value on the control: a user who tabs to the button later, without
re-reading the page, still hears only the label. If you need the value
on the control itself, make `label` itself reactive. Note that passing
a bare `aria-label` attribute will *not* work: `$attrs` falls through
to the root `<div>`, not to the button, so the button keeps the name
built from `label`. Bind the prop instead:

```vue
<TextSizeChooser
    v-model:value="size"
    :label="`Text size: ${sizeLabels[size] ?? size}`"
    :sizes="['small', 'medium', 'large', 'x-large']"
/>
```

That restores the value to the accessible name at the cost of a name
that changes as the user uses the control — which some AT will
re-announce on focus. Pick one; do not do both silently.

Use the `.text-size-chooser-status` class hook for the element.

## Internationalisation

- `label` is consumer-supplied; pass a translated string. It is the
  only accessible name the button has, so an untranslated `label` is a
  visible defect, not a cosmetic one.
- `sizeLabels` entries are consumer-supplied; localise the values.
  Typeahead matches against these labels, so localising them also
  localises the typeahead.
- The component never emits hardcoded English (or any other natural
  language) strings, including the word "default".
- Writing direction inherits from the document's `dir`.

## Visible focus

The chooser does not suppress `:focus` or `:focus-visible` styling. Two
elements take focus and both need a visible indicator: the
`.text-size-chooser-button`, and the `.text-size-chooser-list` itself
while it is open. Style the active option from `[data-active]` — it is
the only signal a sighted keyboard user has, because focus is on the
`<ul>`, not on the option. Forgetting that rule produces a listbox
where arrowing appears to do nothing.

## Reduced motion

The chooser performs no animation. If your CSS transitions `font-size`
on the `data-text-size` swap, respect `prefers-reduced-motion` — an
animated text-size change is exactly the kind of motion that triggers
vestibular symptoms, and it delays the reading the user asked for. The
same applies if you animate the listbox open / closed.

## Screen-reader smoke test

Because this is a scripted widget rather than a platform control, this
list is a **required** check before shipping, not a nicety:

- VoiceOver (macOS + Safari) announces the trigger as "{label},
  pop-up button, collapsed"; on open, focus lands on the list and the
  active option is announced as "{labelFor(slug)}, N of M".
- NVDA (Windows + Firefox) announces "{label} button, collapsed" and,
  on open, the list plus the active option. Verify arrowing announces
  each newly-active option rather than staying silent.
- JAWS (Windows + Chrome) — check the forms-mode handover specifically:
  confirm the arrow keys reach the component instead of moving the
  virtual cursor.
- Mobile (VoiceOver on iOS, TalkBack on Android) — there is no native
  picker here, so confirm the options are reachable by swipe and
  activatable by double-tap.
- The `.text-size-chooser-status` live region should fire once per
  change and stay silent on page load.
- **Test at the largest size and at 200% browser zoom together**, and
  confirm the listbox itself stays usable — it grows with the setting
  it controls, so it is the first thing to overflow.

## Common mistakes to avoid

- **Sizing typography in `px`.** The helper only sets an attribute; if
  your CSS is absolute, the control does nothing. See WCAG 1.4.4
  above.
- **Disabling browser zoom because you shipped this control.** They
  are complementary, not alternatives. Never set
  `user-scalable=no` or `maximum-scale=1`.
- **Rendering interactive markup in the default slot.** The slot's
  content sits *inside* the `<button>`. A nested button or link is
  invalid HTML and breaks activation. Render decorative markup only.
- **Letting slot content carry text.** Visible text inside the button
  competes with `aria-label`. Mark slot content `aria-hidden="true"`,
  or keep it text-free.
- **Styling only `[aria-selected]` and not `[data-active]`.** Keyboard
  users then get no visible cue while arrowing through the list. See
  "Visible focus" above.
- **A small button hit area.** See tradeoff 1 — this control's
  audience needs the target size most.
- **Hiding the button with `display: none`.** That removes it from the
  accessibility tree. Use a visually-hidden pattern
  (`clip-path: inset(50%)` or the `.sr-only` recipe) instead.
- **Adding `tabindex` to the `<li>` options.** They are
  `aria-activedescendant` targets, not tab stops; making them focusable
  breaks the pattern and adds N tab stops to the page.
- **Setting `inheritAttrs: false` on a wrapping component.** Don't
  break the attribute fall-through; consumers rely on it for
  `data-testid`, `id`, and event handlers.
- **Dropping the `.text-size-chooser-status` region to save space.**
  With an icon-only control it is the only channel that surfaces the
  active size.
- **Upgrading the status region to `role="alert"` or
  `aria-live="assertive"`.** That interrupts the user on every size
  change. A size switch is not an emergency; keep it polite.

---

Lily™ and Lily Design System™ are trademarks.
