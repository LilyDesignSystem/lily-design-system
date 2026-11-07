# AiLabel

## Metadata

- Component: ai-label
- PascalCase: AiLabel
- Description: an indicator of AI instances that is a pathway to AI explainability
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <span>
- CSS class: .ai-label
- Interactive: no

## Key Behaviors

- Renders a `<span>` element for inline placement
- Uses `aria-label` for accessible naming
- The `text` prop provides visible label text
- Spreads `restProps` onto the span for consumer customization
- Designed as the first layer of AI explainability; consumers can wrap in a button or attach a popover for deeper explainability content

## ARIA

- `role="img"`, because a `<span>` cannot be named; the label replaces the visible text for screen readers
- `aria-label={label}` -- provides an accessible name for the AI indicator so screen readers announce its purpose

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name for the indicator via `aria-label`
- `text`: string (required) -- visible text displayed inside the indicator
- `...restProps`: unknown -- additional attributes spread onto the `<span>` element

## Acceptance Criteria

- [ ] Renders <span> element with class="ai-label"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .ai-label in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/ai-label.html
- Carbon Design System AI Label: https://carbondesignsystem.com/components/ai-label/usage/
- Carbon for AI Guidelines: https://carbondesignsystem.com/guidelines/carbon-for-ai/
