# Accessibility

WCAG 2.2 AAA is the target. This document states what the control does well and what it costs.

## What it does

- The icon is `aria-hidden="true"`; the accessible name is the consumer-supplied `label`, so it localises with your copy.
- `aria-expanded` on the trigger reflects the list state, and `aria-controls` points at it. The list is named with the same
  `label`.
- The links keep **native link semantics**: real `<a href>` elements with no `role` override, so middle-click,
  open-in-new-tab and copy-link-address all work. A `role="menuitem"` implementation would take all three away.
- The current page's link carries `aria-current="page"` when you mark it `current`.
- Keyboard: `Enter`/`Space` toggle, `ArrowDown`/`ArrowUp` open and move between links (clamping, not wrapping), `Home`/`End`
  jump, `Escape` closes and returns focus to the trigger, `Tab` closes — focus lands on the button first so the default Tab
  proceeds from the picker's position instead of restarting from `<body>`.
- Opening focuses a link without scrolling the page.
- The tooltip is hoverable and dismissable (WCAG 1.4.13): visible on pointer hover or keyboard focus, `Escape` hides it
  wherever focus is, and it is never shown while the list is open.

## What it costs

**The name rests entirely on `label`.** An icon-only control has no visible text fallback. A home icon is widely understood,
but if `label` is wrong, missing or untranslated there is nothing else to go on. Choose a label that says what the list is
("Pages", "Site"), not what the icon is.

**It hides navigation behind a click.** For a handful of links in a header that is the point; for primary site navigation,
use a visible `nav` instead (see `BreadcrumbNav`, `SectionNav`).

**Focus management is real focus**, not `aria-activedescendant`, so screen readers announce each link as it receives focus.
