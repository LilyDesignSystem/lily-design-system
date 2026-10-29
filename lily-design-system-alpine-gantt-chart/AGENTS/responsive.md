## Responsive design principles rules

Lily is headless: the components ship no CSS, so responsive behaviour is decided in the themes and in the consumer's
CSS. These rules bind the 57 `themes/`, the example apps' stylesheets, and any CSS the maintainers write.
Full topic: [spec/responsive/index.md](../spec/responsive/index.md).

### Rules

- **Mobile first** (for new CSS; the existing themes are desktop-first, see the topic). The base rules are the narrow layout. A query adds width (`min-width`), it does not take it away.
- **Intrinsic sizing before breakpoints.** Reach for `minmax()`, `min()`, `clamp()`, `flex-wrap` and `auto-fit` first. Add
  a breakpoint only when the layout genuinely changes (a sidebar appears, a table becomes a list), not to nudge a size.
- **Breakpoints in `rem`, never `px`**, so they follow the viewer's font size. The themes use `48rem`.
- **Container queries for components, viewport queries for page shells.** A card, summary list or data table cares
  about the space it is given, not the window; `grail-layout` and the page header care about the window.
- **Logical properties** (`inline-size`, `margin-inline`, `padding-block`, `inset-inline-start`) so right-to-left needs no
  second stylesheet.
- **Never `width: 100vw` on `body` or a full-width block.** It includes the scrollbar and adds a horizontal one. Use
  `inline-size: 100%` or no width at all.
- **Reflow.** No horizontal scrolling at 320 CSS pixels wide (WCAG 1.4.10), and text that still works at 400% zoom (1.4.4).
  A wide table or code block scrolls inside its own labelled, focusable region; the page does not.
- **Text does not shrink below `1rem`** and is never sized in `vw` alone. Fluid values are for spacing, not text.
- **Text expansion.** Layouts must survive labels 30 percent longer than English (Welsh runs 20 to 30 percent longer); the sweep tests it at 320px.
- **Touch and hover are queries, not guesses.** Use `(hover: none)` and `(pointer: coarse)`, never a viewport width, to
  decide on target size or hover-only affordances.

### Forbidden in the headless layer

Everything above is CSS, so none of it appears in a headless component: no media queries, container queries, `vw`/`vh`
units or breakpoint literals (see [theme.md](theme.md)). A component may expose a prop that the consumer's CSS reads
(for example a `data-*` attribute), never a size.

### Checks

- Each example app's responsive sweep asserts no horizontal overflow at its widths ([spec/testing](../spec/testing/index.md)).
- `bin/test` fails when this file or its topic is missing.
