# FloatButton

## Metadata

- Component: float-button
- PascalCase: FloatButton
- Description: a floating action button anchored to a viewport corner
- HTML tag: <button>
- CSS class: .float-button
- Interactive: yes

## Key Behaviors

- Renders a native <button class="float-button"> element
- Inline style applies position: fixed plus corner offsets per position prop
- position defaults to "bottom-right" and emits data-position
- Default corner offset is 1rem from each edge
- label prop is REQUIRED and sets aria-label
- Defaults to type="button"
- Native disabled attribute prevents click events automatically

## ARIA

- Implicit button role from <button>
- aria-label is the entire accessible name (required)
- aria-disabled from native disabled attribute
- data-position attribute exposes corner anchor

## Keyboard

- Tab: Focus the button
- Enter: Activate the button
- Space: Activate the button

## Props

- `label`: string (REQUIRED)
- `position`: "top-left" | "top-right" | "bottom-left" | "bottom-right" (default: "bottom-right")
- `disabled`: boolean (default: false)
- `type`: "button" | "submit" | "reset" (default: "button")
- `onclick` / `onClick`: callback (optional)
- `children`: slot — icon content
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <button> with class="float-button"
- [ ] aria-label equals the label prop
- [ ] type defaults to "button"
- [ ] position defaults to "bottom-right"
- [ ] data-position is set to the position value
- [ ] Inline style includes position: fixed plus the correct corner offsets
- [ ] disabled attribute is applied when disabled is true
- [ ] Click handler fires on Enter, Space, and click
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .float-button in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/float-button.html
- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/button/
- Ant Design FloatButton: https://ant.design/components/float-button
