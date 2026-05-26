# Pictogram

## Metadata

- Component: pictogram
- PascalCase: Pictogram
- Description: an icon-based component pairing an icon with a title and description in a centered or side layout
- HTML tag: <figure>
- CSS class: .pictogram
- Interactive: no

## Key Behaviors

- Uses a native <figure> element to group icon and caption semantically
- icon is REQUIRED as a slot/snippet/ReactNode prop, NOT children
- Icon container is aria-hidden="true" (decorative); accessible name comes from heading or label
- layout exposed as data-layout ("centered" | "side", default "centered")
- label optionally overrides accessible name
- children (when provided) override the description in the caption

## ARIA

- Implicit `figure` semantics from <figure>
- Icon container has aria-hidden="true" (decorative)
- Accessible name from heading inside <figcaption> or from label
- data-layout is a non-ARIA styling hook

## Keyboard

- None (passive element); interactive children manage their own keyboard behavior.

## Props

- `layout`: "centered" | "side" (default: "centered")
- `heading`: string (optional) -- title text
- `description`: string (optional) -- body text
- `icon`: slot/snippet/ReactNode (REQUIRED) -- the icon content
- `label`: string (optional) -- aria-label override
- `children`: slot (optional) -- overrides description if provided
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <figure> element with class="pictogram"
- [ ] data-layout reflects layout prop, default "centered"
- [ ] Icon container has aria-hidden="true" and class="pictogram-icon"
- [ ] Heading renders inside <figcaption> as <h3 class="pictogram-heading"> when provided
- [ ] Description renders as <p class="pictogram-description"> when provided
- [ ] Children replace description when provided
- [ ] aria-label rendered when label provided
- [ ] icon is a non-optional slot/snippet/ReactNode prop in TS types
- [ ] All user-facing strings come through props (i18n-ready)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .pictogram in css-style-sheet-template.css
- MDN <figure>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure
- Mozilla Protocol Design System: https://protocol.mozilla.org/
