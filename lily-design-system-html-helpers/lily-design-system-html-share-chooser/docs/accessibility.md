# Accessibility — `<share-chooser>` (HTML helper)

WCAG 2.2 AAA is the target. What follows is what the control does, and
then the four places it will cost you something. The costs are real;
none of them are hypothetical.

## What the control does

- **Disclosure pattern, not a menu.** The trigger is a real `<button>`
  with `aria-expanded` and `aria-controls` pointing at a real `<ul>`.
  Destinations are real `<a>` elements with **no `role` override**, so
  middle-click, open-in-new-tab, and copy-link-address all keep working.
  The WAI-ARIA APG suggests exactly this when the items are links.
- **Real focus.** Items are genuinely focusable, so arrow keys move real
  focus rather than an `aria-activedescendant` pointer. Screen readers
  report the focused link the same way they would anywhere else.
- **Full keyboard contract.** Arrows (clamping at the ends), `Home` /
  `End`, `Escape` to close and return focus to the trigger, `Tab` to
  leave without focus being yanked back.
- **Focus is never destroyed by a state change.** Opening, closing,
  announcing, and any `url` / `share-title` / `text` change all update
  attributes in place rather than rebuilding the DOM.
- **The glyph is hidden.** `<span class="share-chooser-icon"
  aria-hidden="true">` keeps the arrow out of the accessible name.
- **The status region is polite and silent on load.** It is empty until
  a copy succeeds or fails, so it announces the outcome and nothing
  else.

## Cost 1 — the accessible name rests entirely on `aria-label`

The trigger has no visible text. Its whole name is the `label`
attribute. Three consequences:

- **A missing or vague `label` leaves the control unnamed.** "Share" is
  the floor; "Share this article" is better when several controls could
  plausibly be a share button.
- **WCAG 2.5.3 Label in Name** applies to anyone using voice control. If
  you later render visible text next to the glyph, the `aria-label` must
  *contain* that visible text, or "click Share" will fail to match.
- **Sighted users get no name at all.** ➤ is not a widely-understood
  share symbol the way a magnifier means search. Consider a visible
  label, or a tooltip, if the surrounding context does not make it
  obvious.

If you need visible text, override `renderButtonContent()` and keep
`aria-label` in sync with what you render.

## Cost 2 — `strategy="auto"` means behaviour differs by platform

Under the default strategy the same markup produces two different
experiences:

- On a phone (and Safari, and Edge): the OS share sheet opens. Your
  `targets` are **never shown**. Neither is your copy item.
- On a typical desktop Firefox or Chrome: your list opens, and the OS
  sheet is never involved.

So:

- **Your `targets` are not guaranteed to be reachable.** If a
  destination genuinely matters, `strategy="list"` is the only way to
  guarantee the user can see it.
- **Documentation and support scripts drift.** "Click share, then choose
  Copy link" is true for only some of your users.
- **The OS sheet is outside your accessibility control.** Its
  keyboard behaviour, contrast, and screen-reader support are the
  platform's, not yours. This is usually a *win* — platform sheets are
  well-tested — but it is not something you can audit or fix.

Choosing `strategy="list"` gives you one predictable experience at the
cost of the native integration users on mobile expect.

## Cost 3 — the glyph is font-dependent

➤ (U+27A4 BLACK RIGHTWARDS ARROWHEAD) is an in-font arrow, not an emoji,
which makes it far safer than a pictograph: it renders monochrome, at
text weight, in the page's own font, and inherits `currentColor`. It
sits in the same family as the sibling helpers' ◑ and "A".

It is still not guaranteed. A font without U+27A4 renders tofu (□), and
the arrow's optical weight varies enough between families that it can
look under- or over-sized next to your text. If your font stack is
narrow, verify it, or override `renderButtonContent()` with inline SVG.

Because the glyph is `aria-hidden`, a tofu box is a purely visual
failure — screen-reader users are unaffected — but it is a visible one.

## Cost 4 — copying can fail invisibly

`navigator.clipboard.writeText()` fails for reasons the user cannot see
and did not cause:

- the page is not in a secure context (plain HTTP),
- the browser denied clipboard permission,
- the document was not focused at the moment of the write,
- the browser has no async clipboard API at all.

The control never throws and always announces, but **the announcement is
the entire recovery path**. So `copy-failed-label` should be
*actionable*, not merely truthful:

- Poor: "Copy failed."
- Better: "Could not copy. Select the address bar and press Ctrl+C."

The same applies to `copied-label`: the visual feedback of a successful
copy is nothing at all, so without it a screen-reader user has no
confirmation the action worked.

Both labels are optional in the API, and omitting them is silent
failure. Supply both.

## Testing checklist

- Tab to the trigger; confirm the announced name is the one you meant.
- Open with `ArrowDown` and with `ArrowUp`; confirm first / last item.
- Arrow past both ends; confirm focus clamps rather than wrapping.
- `Escape`; confirm the list closes **and** focus returns to the trigger.
- `Tab` out of an open list; confirm it closes and focus does not jump back.
- Copy with a screen reader running; confirm the outcome is announced.
- Test with the clipboard denied, and over plain HTTP, and confirm the
  failure message tells the user what to do next.
- Test on a device with a native share sheet **and** one without.

---

Lily™ and Lily Design System™ are trademarks.
