# WarningText

## Metadata

- Component: warning-text
- PascalCase: WarningText
- Description: a short warning shown as an icon and a bold line of text, with a visually hidden prefix supplied by the consumer
- Status: beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows
- HTML tag: <div>
- CSS class: .warning-text
- Interactive: no

## HTML tag decision

The suffix table in `AGENTS/components.md` has no `-text` row, and none is added: the `*-text` components share no
element (`inset-text` and `body-text` are `<div>`, `avatar-text` is `<span>`). The root is a `<div>`, as in GOV.UK and
DHCW, because the warning is a block of content with no landmark or sectioning role. The line itself is a `<strong>`:
it carries strong importance, which is the warning's meaning, not just bold type. Not an `<aside>` (that is a landmark
for content tangential to the page; this warning is about the page) and not `role="alert"` (it is static content, read
in order; see `warning-callout` and `alert` for announced messages).

## Key Behaviors

- Renders `<div class="warning-text {class}">` containing an optional icon wrapper and the text
- The icon is consumer-supplied (Lily bundles no icons) and rendered inside `<span class="warning-text-icon" aria-hidden="true">`, only when supplied (Angular always renders the wrapper, empty when nothing is projected)
- The text renders inside `<strong class="warning-text-text">`
- The visually hidden prefix (for example "Warning") is part of the consumer's content, at the start of the text, hidden with the consumer's own visually-hidden class; there is no prop for it and no default
- Spreads `restProps` onto the root; no state, no live region, no strings

## ARIA

- None added on the root: it is a plain `<div>` with no role, so do not give it `aria-label` (a generic element cannot be named)
- `aria-hidden="true"` on the icon wrapper, so a glyph such as "!" is not read
- The hidden prefix gives screen reader users the kind of message before its text

## Keyboard

- None. The component is not focusable

## Props

- `class`: string (default: `""`) -- appended to the base class
- `icon`: slot (optional) -- the decorative icon; rendered inside the `aria-hidden` wrapper
- `children`: slot (required) -- the visually hidden prefix, then the warning text
- `...restProps`: HTML attributes -- spread onto the root `<div>`

## Acceptance Criteria

- [x] Renders <div> with class="warning-text"; consumer class appended; rest props spread
- [x] The icon renders inside `.warning-text-icon` with `aria-hidden="true"`, only when supplied
- [x] The text renders inside `<strong class="warning-text-text">`, hidden prefix included
- [x] Adds no text of its own
- [ ] WCAG 2.2 AAA compliant
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.warning-text` in css-style-sheet-template.css
- [GOV.UK Design System: Warning text](https://design-system.service.gov.uk/components/warning-text/)
- [DHCW Design System: Warning callout (Warning text variant)](https://dhcw-digital-health-and-care-wales.github.io/dhcw-design-system/components/warning-callout.html)
