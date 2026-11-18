# Accessibility

WCAG 2.2 AAA is the target. This document states what the control does well and what it costs.

## What it does

- The icon is `aria-hidden="true"`; the accessible name is the consumer-supplied `label`, so it localises with your copy.
- `aria-expanded` on the trigger reflects the panel state, and `aria-controls` points at it. The panel is a `role="group"`
  named with the same `label`.
- **It is a disclosure, not an ARIA menu.** Arbitrary content (links, buttons, inputs, headings) inside `role="menu"` would
  promise arrow-key `menuitem` behaviour it does not have, and would strip the native semantics of links. Native semantics
  are kept; the APG's disclosure pattern is the model.
- Keyboard: `Enter`/`Space` toggle; `ArrowDown`/`ArrowUp` on the button open and move to the panel's first/last focusable
  element; `Escape` closes and returns focus to the button; `Tab` closes — focus lands on the button first so the default Tab
  proceeds from the picker's position instead of restarting from `<body>`.
- A click does not move focus into the panel (a disclosure must not steal focus); keyboard users reach it with the arrows or
  Tab.
- Clicking outside, or focus leaving the picker, closes the panel.
- The tooltip is hoverable and dismissable (WCAG 1.4.13): visible on pointer hover or keyboard focus, `Escape` hides it
  wherever focus is, and it is never shown while the panel is open.

## What it costs

**The name rests entirely on `label`.** An icon-only control has no visible text fallback. The cog is widely understood,
but if `label` is wrong, missing or untranslated there is nothing else to go on. Choose a label that says what the panel is
("Settings", "Options"), not what the icon is.

**The content's accessibility is yours.** The panel contains whatever you put in it; give links real text, inputs real labels
and headings a sensible order.

**It hides things behind a click.** For primary site navigation, use a visible `nav` (see `BreadcrumbNav`, `SectionNav`).
