# Accessibility

WCAG 2.2 AAA is the target. This document states what the control does
well and what it costs.

## What it does

- The magnifying-glass icon is `aria-hidden="true"`; the trigger's
  accessible name is the consumer-supplied `Label`.
- `aria-expanded` on the trigger reflects the panel state, and
  `aria-controls` points at it.
- The panel is a real `<form role="search">`, a search landmark named by
  `Label`, so screen-reader users can jump straight to it once open.
- The field is a native `type="search"` input named by `InputLabel`;
  Return submits it natively, and mobile browsers show a search keyboard
  (`enterkeyhint="search"`).
- The submit button is a native `type="submit"` button named by
  `SubmitLabel`. Its visible `⏎` is `aria-hidden`, so assistive
  technology announces the action, not "return symbol".
- Opening moves focus into the field; `Escape` closes and returns focus
  to the trigger; every focus move passes `preventScroll: true`.
- Tab moves natively field → `⏎` → out. Moving between the root's own
  controls keeps the panel open; leaving the root closes it.

## What it costs

**The trigger's name rests entirely on `aria-label`.** An icon-only
control has no visible text fallback. If `Label` is wrong or
untranslated, sighted and non-sighted users alike are left guessing —
though a magnifying glass is about as widely understood as an icon gets.

**`⏎` assumes the symbol is understood.** It names a key, not an action.
Sighted users who don't read it as "submit" still have Return in the
field; screen-reader users get `SubmitLabel`. If your audience may not
know the symbol, replace the button content with CSS or surface
`SubmitLabel` as a tooltip.

**Navigation leaves the page.** The default
`NavigationManager.NavigateTo(href, forceLoad: true)` is a full GET.
That is the point (a real, bookmarkable `/?<query>` URL), but it means
focus and scroll position reset. Pass `Navigate` to route in-app.

**`Escape` may clear the field.** Blazor cannot cancel the default of a
single key, so in browsers whose search fields clear on `Escape`, the
text is cleared as the panel closes. The canonical Svelte helper keeps
it. See spec §9.

**Closing on an outside click relies on focus.** There is no standing
document-level click listener (no JS file ships). An outside click is
detected from the blur it causes: the component asks the browser where
focus went, and when it went to `<body>` it waits for the click and
closes only if that click landed outside the picker. So Safari's
click-without-focus on the icon button or `⏎` never closes the panel
out from under the click. On a slow `InteractiveServer` connection a
very fast outside click can be missed, leaving the panel open — it
never wrongly closes.
