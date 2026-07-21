# Accessibility

WCAG 2.2 AAA is the target. This document states what the control does
well and what it costs — the costs are real and are not talked around.

## What it does

- The glyph is `aria-hidden="true"`; the accessible name is the
  consumer-supplied `aria-label`, so it localises with your copy.
- `aria-expanded` on the trigger reflects the list state, and
  `aria-controls` points at it.
- Destinations keep **native link semantics**: they are real `<a>`
  elements with no `role` override, so middle-click, open-in-new-tab and
  copy-link-address all work. A `role="menuitem"` implementation would
  take all three away.
- Keyboard: `Enter`/`Space` activate, `ArrowDown`/`ArrowUp` open and move
  between items (clamping, not wrapping), `Home`/`End` jump, `Escape`
  closes and returns focus to the trigger, `Tab` closes and lets focus
  move on. Items are real focusable elements, so focus moves for real
  rather than via `aria-activedescendant`.
- Copying is otherwise silent, so its outcome is announced in an
  `aria-live="polite"` region that is empty on load.

## What it costs

**The name rests entirely on `aria-label`.** An icon-only control has no
visible text fallback. If `label` is wrong, missing, or untranslated,
there is nothing else for anyone to go on — sighted users included, since
➤ is not self-evidently "share". If you can spare the space, pair the
button with visible text.

**Behaviour differs by platform.** With `strategy="auto"`, a phone opens
the OS share sheet and a desktop opens the in-page list. That is usually
the better experience on each, but it means your help text and support
scripts cannot describe one flow. Force one with `strategy="list"` if
consistency matters more.

**The glyph is font-dependent.** ➤ (U+27A4) is an in-font arrow rather
than a pictograph, so it is far safer than an emoji — it renders in the
page's own font and stays monochrome. It is still not guaranteed on every
font stack. Override it with the `children` render prop if your stack
lacks it.

**Copy can fail for reasons the user cannot see.** An insecure context, a
denied permission, or a browser with no async clipboard all fail. Always
supply `copyFailedLabel` and make it actionable — say what to do instead
("copy it from the address bar"), not just that it failed.

## React-specific notes

- Focus lands on a list item one commit after the open, because the
  items do not exist in the DOM until React has rendered them. Users do
  not perceive the gap, but a test that asserts focus immediately after
  a synthetic click without flushing effects will see the trigger still
  focused.
- The status region is a plain rendered `<p>`; React replaces its text
  node on change, which is a mutation inside a live region and so is
  announced. Do not memoise it into stability — an unchanged node is a
  silent one.

## What to check in review

- `label` is supplied, translated, and describes the action.
- `copiedLabel` and `copyFailedLabel` are supplied if `copyLabel` is.
- Destination labels are real words, not brand glyphs.
- The status region is not styled `display: none` — that silences it.
  Use a visually-hidden recipe if you must hide it visually.

---

Lily™ and Lily Design System™ are trademarks.
