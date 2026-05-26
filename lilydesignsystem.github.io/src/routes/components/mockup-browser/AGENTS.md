# MockupBrowser

## Metadata

- Component: mockup-browser
- PascalCase: MockupBrowser
- Description: a box area that looks like a web browser
- HTML tag: <div>
- CSS class: .mockup-browser
- Interactive: no

## Key Behaviors

- Uses `<div>` element with `role="img"` for decorative presentation
- `aria-label` describes the mockup content for screen readers
- Contains a slot for the browser content area

## ARIA

- `role="img"` -- presents the mockup as a single image to assistive technologies
- `aria-label` -- describes the mockup content for screen readers

## Keyboard

- None -- mockups are decorative, not interactive

## Props

- `label`: string (required) -- accessible label describing the mockup content
- `children`: slot (required) -- the content displayed inside the browser mockup
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="mockup-browser"
- [ ] Has role="img"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .mockup-browser in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/mockup-browser.html
