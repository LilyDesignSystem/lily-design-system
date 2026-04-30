# StepListItem

## Metadata

- Component: step-list-item
- PascalCase: StepListItem
- Description: one step in a step list with status of waiting, in progress, finished, or error
- HTML tag: <li>
- CSS class: .step-list-item
- Interactive: no

## Key Behaviors

- Renders a semantic <li class="step-list-item"> element
- data-status reflects the status prop (default "waiting")
- aria-current="step" is set when current is true
- aria-label is set when the optional label prop is provided
- Composition: child of step-list

## ARIA

- <li> provides list-item semantics
- aria-current="step" when current is true
- aria-label set when label prop is provided
- data-status is a CSS hook for status-driven styling

## Keyboard

- None at this level — interactive behavior lives on children

## Props

- `status`: "waiting" | "in-progress" | "finished" | "error" (default: "waiting")
- `current`: boolean (default: false)
- `label`: string (optional)
- `children`: slot
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <li> with class="step-list-item"
- [ ] data-status reflects the status prop
- [ ] aria-current="step" set when current is true and absent when false
- [ ] aria-label equals the label prop when provided
- [ ] Children render inside the list item
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .step-list-item in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/step-list-item.html
- WAI-ARIA aria-current: https://www.w3.org/TR/wai-aria-1.2/#aria-current
- Ant Design Steps: https://ant.design/components/steps
