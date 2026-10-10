# Accessibility — `<lily-search-picker>`

WCAG 2.2 AAA is the target. This document states what the control does
well and what it costs.

## What it does

- The magnifying-glass icon is `aria-hidden="true"`; the trigger's
  accessible name is the consumer-supplied `label`.
- `aria-expanded` on the trigger reflects the panel state, and
  `aria-controls` points at it.
- The panel is a real `<form role="search">`, a search landmark named by
  `label`, so screen-reader users can jump straight to it once open.
- The field is a native `type="search"` input named by `input-label`;
  Return submits it natively, and mobile browsers show a search keyboard
  (`enterkeyhint="search"`).
- The submit button is a native `type="submit"` button named by
  `submit-label`. Its visible `⏎` is `aria-hidden`, so assistive
  technology announces the action, not "return symbol".
- Opening moves focus into the field; `Escape` closes and returns focus
  to the trigger; every focus move passes `preventScroll`.

## What it costs

**The trigger's name rests entirely on `aria-label`.** An icon-only
control has no visible text fallback. If `label` is wrong or
untranslated, sighted and non-sighted users alike are left guessing —
though a magnifying glass is about as widely understood as an icon gets.

**`⏎` assumes the symbol is understood.** It names a key, not an action.
Sighted users who don't read it as "submit" still have Return in the
field; screen-reader users get `submit-label`. If your audience may not
know the symbol, show the `submit-label` text visibly with CSS or
replace the button content.

**Navigation leaves the page.** The default `location.assign` is a full
GET. That is the point (a real, bookmarkable `/?<query>` URL), but it
means focus and scroll position reset. Assign the `navigate` property to
keep a single-page app in-app.
