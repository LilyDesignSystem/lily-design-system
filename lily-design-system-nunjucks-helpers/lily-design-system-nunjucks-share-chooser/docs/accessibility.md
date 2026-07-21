# Accessibility

The control targets WCAG 2.2 AAA. It is a **disclosure**: a glyph
`<button>` whose `aria-expanded` / `aria-controls` govern a `<ul>` of
real links plus an optional copy `<button>`.

This page states the costs of that design plainly. Several are real and
none of them are fixed by the helper.

## Why a disclosure and not a menu

Share destinations are navigation. They render as real `<a>` elements
with **no `role` override**, and that is load-bearing.

`role="menuitem"` would have made the list a `menu`, which sounds
tidier and is worse. It strips the affordances a link carries natively:
middle-click to open in a background tab, `Ctrl`/`Cmd`-click, the
context menu's "Open in new window" and "Copy link address", and the
screen-reader link rotor. Those are exactly the affordances people reach
for on a share list — "give me that URL" is half of why the list is
open at all. The WAI-ARIA Authoring Practices themselves point at a
disclosure when the items are links.

The cost of the choice: the list is not a menu, so it does not get menu
semantics. A screen-reader user who has learned the menu pattern will
not hear "menu, 3 items". They hear a button that expands, and then a
list of links — which is what it is.

Copy is a genuine action rather than navigation, so it is a real
`<button>` in the same list. Mixing a button among links is deliberate
and honest: they do different things and are announced differently.

## The accessible name rests entirely on `aria-label`

The trigger is glyph-only. The glyph is `aria-hidden="true"`, so
`opts.label` is the **only** accessible name the button has. There is no
visible text fallback.

Consequences to weigh before shipping:

- **A missing or vague `label` leaves the control unusable to screen
  reader users**, announced as "button" and nothing else. `label` is
  required for this reason. Make it say what it shares — "Share this
  article", not "Share".
- **Voice-control users must guess.** Someone saying "click Share" is
  relying on the `aria-label` matching what they *see*, and they see an
  arrow. WCAG 2.5.3 (Label in Name) is satisfied vacuously here because
  there is no visible text to disagree with — but the spirit of it is
  not. If your users use voice control, put a visible text label next to
  the glyph via a `{% call %}` body:

  ```njk
  {% call shareChooser({label: "Share this article", targets: t}) %}
    <span aria-hidden="true">↪</span> Share
  {% endcall %}
  ```

  Note the visible word then duplicates part of the `aria-label`, which
  is fine and intended: the label must *contain* the visible string.
- **Cognitive load.** An unlabelled arrow is not self-evident as
  "share". A visible label, or a tooltip you supply yourself, helps
  everyone and costs nothing.

## The glyph is font-dependent

The default glyph is U+21AA RIGHTWARDS ARROW WITH HOOK (↪), chosen the
same way as the other helpers' glyphs: an in-font arrow rather than a
pictograph. It inherits the page's font, stays monochrome, respects
`currentColor`, and scales with the type.

It is **much** safer than an emoji — no colour-font substitution, no
platform-specific redesign, no "share icon" that looks like a different
product on each OS — but it is not guaranteed. A font without the
codepoint renders tofu (▯). If your font stack is narrow or you serve a
subsetted webfont, either check U+21AA is in the subset or override the
glyph with an inline SVG via `{% call %}`.

Whatever you substitute, keep it `aria-hidden="true"` — the name comes
from `aria-label` and a second source would double-announce.

## Behaviour differs by platform under `strategy="auto"`

With the default `strategy: "auto"` the control does **two different
things** depending on the browser:

- Where `navigator.share` exists (most mobile browsers, Safari on
  macOS), it opens the OS share sheet. The list never appears.
- Elsewhere (most desktop browsers), it opens the in-page list.

So the same button, documented once, produces a different experience per
user — and an OS share sheet is a surface this helper has no control
over: its keyboard handling, focus behaviour, contrast and screen-reader
support are the platform's, not yours, and you cannot test them from
your own code.

That is usually the right trade, because the native sheet is what the
user's platform has taught them and it reaches destinations a web page
cannot. But it means:

- **Your documentation and support material cannot describe one
  behaviour.** Screenshots of the list will not match what a phone user
  sees.
- **Your own accessibility testing only covers the list path.** Test the
  native path by hand on a real device.
- If you need one predictable, testable, styleable behaviour everywhere,
  set `strategy: "list"`. You lose the platform integration and gain
  consistency.

## Copy can fail invisibly, so `copyFailedLabel` must be actionable

`navigator.clipboard.writeText` fails for reasons the user cannot see
and did not cause:

- the page is not in a secure context (plain HTTP),
- the browser has no async clipboard API,
- the document was not focused at the moment of the write,
- a permissions policy or extension blocked it,
- the OS clipboard refused.

The helper never throws on any of these. It announces
`copyFailedLabel` in the polite live region and closes the list — which
means **the message is the entire recovery path**. A failure message of
"Copy failed" tells the user nothing they can act on.

Write one that names the alternative:

> "Could not copy automatically — select the address bar and copy the
> link from there."

Both `copiedLabel` and `copyFailedLabel` are optional. If you omit them,
the copy outcome is announced **not at all**: success and failure are
indistinguishable, and a blind user has no way to know whether the
clipboard now holds the URL. Supply both, in the user's language, or do
not offer copy.

There is no default for `copyLabel` either, and none for the other two,
because a default would be a hardcoded English string —
`AGENTS/internationalization.md` forbids it. The copy item therefore
renders only when you name it.

## Keyboard

| Key | On the trigger | In the list |
| --- | -------------- | ----------- |
| `Enter` / `Space` | Activates (native button behaviour) | Activates the focused item |
| `ArrowDown` | Opens, focuses the first item | Moves focus down, clamping |
| `ArrowUp` | Opens, focuses the last item | Moves focus up, clamping |
| `Home` / `End` | — | First / last item |
| `Escape` | — | Closes, returns focus to the trigger |
| `Tab` | Moves on | Closes; focus goes where the browser was sending it |

Items are real focusable elements, so focus **actually moves** — no
`aria-activedescendant`. That means a screen reader announces each item
the way it would announce any link or button, and browser find-in-page
and caret browsing behave normally.

Arrows **clamp** rather than wrap. At the last item, `ArrowDown` stays
put. Wrapping in a short list of links is disorienting when focus is
real: the user hears the first item again with no event to explain why.

`Escape` returns focus to the trigger, so the user is never dropped at
the top of the document. `Tab` closes without stealing focus back, so
tabbing past the control does not trap or rewind.

## The live region

`<p class="share-chooser-status" aria-live="polite">` is empty on load
and only ever holds a copy outcome. Polite, so it waits for a pause
rather than interrupting. Empty at render, so it announces nothing on
page load — a live region with initial content is a classic source of
spurious announcements.

It is a `<p>` in the flow, not visually hidden. Style it as you like,
including `.share-chooser-status:empty { display: none }` — do **not**
give it `display: none` unconditionally, or `hidden`, since that stops
some screen readers announcing changes to it.

## What consumer CSS still owes

The package ships no CSS, so these remain yours:

- **Visible focus** on the trigger, every link, and the copy button
  (WCAG 2.4.7, and 2.4.11 Focus Not Obscured at AAA). The helper never
  suppresses focus rings; it also never draws them.
- **Target size** of at least 44×44 CSS pixels for the trigger and each
  item (WCAG 2.5.5 at AAA). A glyph button is easy to render too small —
  the glyph is one character.
- **Contrast** of at least 7:1 for the glyph and item text against their
  backgrounds (WCAG 1.4.6 at AAA).
- **An open list that does not obscure the trigger**, and that stays on
  screen at 320px width and 400% zoom (WCAG 1.4.10).
- **`prefers-reduced-motion`** if you animate the disclosure. The helper
  animates nothing.

## Testing checklist

- Keyboard only: open, traverse with arrows, `Home`/`End`, choose a
  destination, `Escape` back to the trigger, `Tab` past it.
- Screen reader (VoiceOver / NVDA): confirm the trigger's name is your
  `label`, the expanded state is announced, items are announced as
  links, and the copy outcome is announced once.
- Force a copy failure (serve over plain HTTP) and confirm the message
  you wrote actually tells the user what to do.
- Test the native sheet on a real phone; do not infer it from the
  desktop.
- Zoom to 400% at 320px width and confirm the open list is reachable.

---

Lily™ and Lily Design System™ are trademarks.
