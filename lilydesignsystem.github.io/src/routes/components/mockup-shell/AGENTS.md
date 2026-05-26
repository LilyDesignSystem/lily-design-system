# MockupShell

## Metadata

- Component: mockup-shell
- PascalCase: MockupShell
- Description: a box area that looks like a terminal shell
- HTML tag: <div>
- CSS class: .mockup-shell
- Interactive: no

## Key Behaviors

- Uses `<div>` element with `role="img"` for decorative presentation
- `aria-label` describes the mockup content for screen readers
- Contains a slot for the terminal content area

## ARIA

- `role="img"` -- presents the mockup as a single image to assistive technologies
- `aria-label` -- describes the mockup content for screen readers

## Keyboard

- None -- mockups are decorative, not interactive

## Props

- `label`: string (required) -- accessible label describing the mockup content
- `children`: slot (required) -- the content displayed inside the shell mockup
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="mockup-shell"
- [ ] Has role="img"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .mockup-shell in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/mockup-shell.html
