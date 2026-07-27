# Accessibility

The chooser targets WCAG 2.2 AAA. It is an icon button that opens a
WAI-ARIA APG listbox: the roles, the properties, the focus management,
and the whole keyboard contract are implemented by the component rather
than inherited from a native `<select>`.

That is a deliberate trade, and it is not free. This page documents
what the component gives you, what it costs, and the pattern that
compensates.

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
| `<span class="theme-chooser-icon">` | `aria-hidden="true"`                 | Component     |
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
listbox and it means `End`-then-`ArrowDown` cannot silently teleport a
screen-reader user back to the top of a long theme list.

Pointer and focus behaviour: clicking an option selects and applies it;
clicking outside the root closes the listbox; focus leaving the root
closes it. Closing by click-outside or by `Tab` does **not** pull focus
back to the button, so the user's own focus movement is never fought.

## State signals

The active theme is exposed in three independent channels — no
colour-only meaning is required:

1. `data-theme="<slug>"` on the target element (default `<html>`).
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

A `role="listbox"` + `aria-activedescendant` widget re-implements all
of that in script. This implementation is APG-conformant and
keyboard-complete — every key in the table above is covered by a test —
but conformance and coverage are not the same thing:

- **Real-world screen reader coverage is less uniform.** `aria-activedescendant`
  is well-supported in principle and unevenly supported in practice;
  announcements of the active option vary by AT and version.
- **Forms mode / browse mode interactions vary.** A virtual-cursor user
  may need to enter forms mode before the arrow keys reach the
  component at all, and whether that happens automatically depends on
  the AT.
- **There is no native mobile picker.** On a phone the listbox is a
  small styled list rather than the OS control the user expects.

What is bought with that: a compact control that does not grow to fit
the longest theme name, renders identically across browsers, and can be
styled completely. Whether that is a good trade is a decision for your
accessibility reviewer, not a foregone conclusion. If your product's
priority is maximal AT robustness over visual control, a native
`<select>` remains the more conservative choice, and the headless
catalog entry
(`lily-design-system-vue-headless/components/ThemeChooser/`) is still a
plain `<select>` container.

Test the real thing. See the screen-reader smoke test below.

## Tradeoff 3: the glyph is platform-dependent

The default button content is `◑` (U+25D1 CIRCLE WITH RIGHT HALF
BLACK), exported as `CIRCLE_WITH_RIGHT_HALF_BLACK`. It is a text
character rendered from the user's installed fonts, so:

- It may render with **different weight, size, or baseline alignment**
  than your surrounding UI, since it is likely to come from a fallback
  font rather than your body face.
- It may be **substituted** by a font the user did not choose, which is
  how the same glyph ends up looking flat in one browser and emoji-like
  in another.
- It may be **missing entirely** and render as tofu (`□`) on
  minimal-font systems and some Linux and embedded environments.

None of that breaks the accessible name — the glyph is
`aria-hidden="true"` and the name comes from `label` — but a control
whose only visible affordance is a box is a usability failure for
sighted users regardless.

**If you care about visual consistency, ship your own SVG through the
default slot.** An inline SVG renders identically everywhere and can
inherit `currentColor`:

```vue
<ThemeChooser
    label="Theme"
    themes-url="/assets/themes/"
    :themes="['light', 'dark', 'abyss']"
    v-model:value="theme"
>
    <template #default="{ open }">
        <svg
            class="theme-chooser-icon"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
            focusable="false"
            :data-open="open ? '' : undefined"
        >
            <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" />
            <path d="M8 1a7 7 0 0 1 0 14Z" fill="currentColor" />
        </svg>
    </template>
</ThemeChooser>
```

Keep `aria-hidden="true"` and `focusable="false"` on the SVG: the
first stops it competing with `aria-label`, the second stops legacy
Internet Explorer / Edge behaviour from making it a tab stop.

## The status region is the default pattern

Every example in this package pairs the chooser with a status region,
and so does the quick start in [`index.md`](../index.md). **Shipping it
is the default; removing it is the deliberate choice** you make with
your accessibility reviewer — not something you opt into later.

The reason has changed with the rewrite, and it is now stronger. The
old `<select>` was pinned to a placeholder, so it announced the wrong
thing. The new control is icon-only, so it announces **nothing at all**
about the active theme: the closed button shows a glyph, its accessible
name is the static `label`, and the active slug appears only in
`data-theme` and in your binding. There is no on-screen and no
announced representation of which theme is active unless you render
one.

```vue
<script setup lang="ts">
import { ref } from "vue";
import ThemeChooser from "../ThemeChooser.vue";

const theme = ref("");
const themeLabels = { light: "Light", dark: "Dark", abyss: "Abyss" };
</script>

<template>
    <ThemeChooser
        v-model:value="theme"
        label="Theme"
        themes-url="/assets/themes/"
        :themes="['light', 'dark', 'abyss']"
    />

    <p class="theme-chooser-status" aria-live="polite">
        Active theme: {{ themeLabels[theme] ?? theme }}
    </p>
</template>
```

Three decisions are baked into that snippet:

1. **Visible, not `sr-only`.** The active theme is invisible in an
   icon-only control, so a visible line helps sighted users and
   cognitive accessibility as well as screen-reader users — which is
   what WCAG AAA favours. If your design truly cannot spare the line,
   keep the element and apply the visually-hidden recipe in
   [`styling.md`](./styling.md); do not delete it.
2. **`aria-live="polite"`, not `role="alert"`.** A polite live region
   announces *mutations* only, so it is silent on first paint and
   speaks once per change, without moving focus. That matters here:
   focus is being managed already (it returns to the button on commit),
   and a region that stole it would fight the component. It also
   matches WCAG 3.2.2 (On Input): changing a setting must not change
   context.
3. **Human label, not the raw slug.** Show `labelFor(slug)` /
   `themeLabels[slug]` so the announcement reads "Active theme: Dark",
   not "Active theme: dark". All strings are consumer-supplied, so
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
<ThemeChooser
    v-model:value="theme"
    :label="`Theme: ${themeLabels[theme] ?? theme}`"
    themes-url="/assets/themes/"
    :themes="['light', 'dark', 'abyss']"
/>
```

That restores the value to the accessible name at the cost of a name
that changes as the user uses the control — which some AT will
re-announce on focus. Pick one; do not do both silently.

Use the `.theme-chooser-status` class hook for the element — it is the
documented hook, listed in [`styling.md`](./styling.md).

## Internationalisation

- `label` is consumer-supplied; pass a translated string. It is the
  only accessible name the button has, so an untranslated `label` is a
  visible defect, not a cosmetic one.
- `themeLabels` entries are consumer-supplied; localise the values.
  Typeahead matches against these labels, so localising them also
  localises the typeahead.
- The component never emits hardcoded English (or any other natural
  language) strings, including the word "default".
- Writing direction inherits from the document's `dir`.

## Visible focus

The chooser does not suppress `:focus` or `:focus-visible` styling. Two
elements take focus and both need a visible indicator: the
`.theme-chooser-button`, and the `.theme-chooser-list` itself while it is
open. Style the active option from `[data-active]` — it is the only
signal a sighted keyboard user has, because focus is on the `<ul>`, not
on the option. Forgetting that rule produces a listbox where arrowing
appears to do nothing.

## Reduced motion

The chooser performs no animation. Theme CSS files are responsible for
respecting `prefers-reduced-motion` if they introduce transitions on
the `data-theme` swap. If you animate the listbox open / closed from
consumer CSS, respect it there too.

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
- The `.theme-chooser-status` live region should fire once per change
  and stay silent on page load.

## Common mistakes to avoid

- **Rendering interactive markup in the default slot.** The slot's
  content sits *inside* the `<button>`. A nested button or link is
  invalid HTML and breaks activation. Render decorative markup only.
- **Letting slot content carry text.** Visible text inside the button
  competes with `aria-label`. Mark slot content `aria-hidden="true"`,
  or keep it text-free.
- **Styling only `[aria-selected]` and not `[data-active]`.** Keyboard
  users then get no visible cue while arrowing through the list. See
  "Visible focus" above.
- **Hiding the button with `display: none`.** That removes it from the
  accessibility tree. Use a visually-hidden pattern
  (`clip-path: inset(50%)` or the `.sr-only` recipe) instead.
- **Adding `tabindex` to the `<li>` options.** They are
  `aria-activedescendant` targets, not tab stops; making them focusable
  breaks the pattern and adds N tab stops to the page.
- **Forgetting to translate `themeLabels`.** The chooser only knows what
  the consumer tells it; locale-aware copy is the consumer's
  responsibility.
- **Setting `inheritAttrs: false` on a wrapping component.** Don't
  break the attribute fall-through; consumers rely on it for
  `data-testid`, `id`, and event handlers.
- **Dropping the `.theme-chooser-status` region to save space.** With an
  icon-only control it is the only channel that surfaces the active
  theme. If space is the problem, hide it visually with the recipe in
  [`styling.md`](./styling.md) — that keeps the announcement.
- **Upgrading the status region to `role="alert"` or
  `aria-live="assertive"`.** That interrupts the user on every theme
  change. A theme switch is not an emergency; keep it polite.

---

Lily™ and Lily Design System™ are trademarks.
