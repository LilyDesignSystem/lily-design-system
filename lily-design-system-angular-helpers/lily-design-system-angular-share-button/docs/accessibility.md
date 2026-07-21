# Accessibility

WCAG 2.2 AAA is the target. This document states what the control does
well and what it costs — the costs are real and are not talked around.

## What it does

- The glyph is `aria-hidden="true"`; the accessible name is the
  consumer-supplied `aria-label`, so it localises with your copy.
- `aria-expanded` on the trigger reflects the list state, and
  `aria-controls` points at it. The list carries a per-instance id from
  `nextShareButtonId()`, so several share buttons on one page never
  collide.
- Destinations keep **native link semantics**: they are real `<a>`
  elements with no `role` override, so middle-click, open-in-new-tab and
  copy-link-address all work. A `role="menuitem"` implementation would
  take all three away. The WAI-ARIA APG itself suggests a disclosure
  when the items are links.
- Copy is a real `<button>`, because it is an action rather than
  navigation.
- Keyboard: `Enter` / `Space` activate, `ArrowDown` / `ArrowUp` open and
  move between items (clamping, not wrapping), `Home` / `End` jump,
  `Escape` closes and returns focus to the trigger, `Tab` closes and
  lets focus move on. Items are real focusable elements, so focus moves
  for real rather than via `aria-activedescendant`.
- Focus leaving the root, or a click outside it, closes the list
  without yanking focus back.
- Copying is otherwise silent, so its outcome is announced in an
  `aria-live="polite"` region that is empty on load — it announces
  mutations only, so it stays quiet on first paint.

## What it costs

**The name rests entirely on `aria-label`.** An icon-only control has no
visible text fallback. If `label` is wrong, missing, or untranslated,
there is nothing else for anyone to go on — sighted users included,
since ↪ is not self-evidently "share". If you can spare the space, pair
the button with visible text, or project an `<ng-template>` that renders
a word instead of the glyph.

**Behaviour differs by platform.** With `strategy="auto"`, a phone opens
the OS share sheet and a desktop opens the in-page list. That is usually
the better experience on each, but it means your help text and support
scripts cannot describe one flow, and a keyboard or screen-reader user
on a touch device meets an OS surface this package does not control.
Force one path with `strategy="list"` if consistency matters more.

**The glyph is font-dependent.** ↪ (U+21AA) is an in-font arrow rather
than a pictograph, so it is far safer than an emoji — it renders in the
page's own font and stays monochrome alongside theme-select's ◑,
locale-select's 🌐 and text-size-select's "A". It is still not
guaranteed on every font stack. Override it with a projected
`<ng-template>` if your stack lacks it.

**Copy can fail for reasons the user cannot see.** An insecure context
(plain HTTP), a denied permission, or a browser with no async clipboard
all fail, and none of them are visible to the person who just clicked.
Always supply `copyFailedLabel` and make it actionable — say what to do
instead ("copy it from the address bar"), not just that it failed.

**The list ships no positioning CSS.** `<ul class="share-button-list">`
sits in normal document flow, so it pushes content down when opened
unless you give it `position: absolute` inside a `position: relative`
root. Content jumping under a keyboard user is a real usability cost;
style it. Use `inset-inline-start`, not `left`, so it follows
`dir="rtl"`.

## What to check in review

- `label` is supplied, translated, and describes the action.
- `copiedLabel` and `copyFailedLabel` are supplied if `copyLabel` is.
- Destination labels are real words, not brand glyphs.
- The status region is not styled `display: none` — that silences it.
  Use a visually-hidden recipe if you must hide it visually.
- The trigger has a visible focus indicator, and the open list does not
  obscure it.

---

Lily™ and Lily Design System™ are trademarks.
