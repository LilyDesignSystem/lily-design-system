# StepList

## Metadata

- Component: step-list
- PascalCase: StepList
- Description: an ordered list of step items showing progress through a multi-step process
- HTML tag: <ol>
- CSS class: .step-list
- Interactive: no

## Key Behaviors

- Renders a semantic <ol class="step-list"> element
- aria-label is set when the optional label prop is provided
- data-current is set when the optional current prop (0-based index) is provided
- Composition: parent of step-list-item children

## ARIA

- <ol> provides list semantics
- aria-label provides the accessible name when label is set
- data-current is a CSS hook for the active step index

## Keyboard

- None at this level — interactive behavior lives on children

## Props

- `label`: string (optional)
- `current`: number (optional, 0-based index)
- `children`: slot — step-list-item children
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <ol> with class="step-list"
- [ ] aria-label is set when label is provided
- [ ] data-current reflects the current prop when provided
- [ ] Children render in document order
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .step-list in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/step-list.html
- Ant Design Steps: https://ant.design/components/steps
