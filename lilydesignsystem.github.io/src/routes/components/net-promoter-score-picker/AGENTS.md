# NetPromoterScorePicker

## Metadata

- Component: net-promoter-score-picker
- PascalCase: NetPromoterScorePicker
- Description: a picker for selecting a 0-10 Net Promoter Score
- HTML tag: <div>
- CSS class: .net-promoter-score-picker
- Interactive: yes

## Composition

- Pattern: Picker/PickerButton
- Children: net-promoter-score-picker-button

## Companion

- net-promoter-score-view

## Key Behaviors

- Renders as `<fieldset role="radiogroup">` with 11 radio buttons (0-10)
- Each radio has `aria-label` with its numeric value for screen readers
- The `value` prop is two-way binding
- Default radio group name is "nps", customizable via `name` prop
- Radio values are strings ("0" through "10")

## ARIA

- `role="radiogroup"` on the fieldset
- `aria-label` on the fieldset from the label prop
- Each radio has `aria-label` with its numeric value

## Keyboard

- Arrow keys navigate between radio buttons (native radio group behavior)
- Space selects the focused radio button
- Tab moves focus into/out of the radio group

## Props

- `label`: string (required) -- accessible label for the radiogroup
- `value`: string (default: "") -- currently selected score, bindable
- `name`: string (default: "nps") -- name attribute for the radio group
- `...restProps`: Any additional HTML attributes spread onto the fieldset

## Acceptance Criteria

- [ ] Renders <div> element with class="net-promoter-score-picker"
- [ ] Has aria-label attribute
- [ ] Has role="radiogroup"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .net-promoter-score-picker in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/net-promoter-score-picker.html
- Net Promoter Score: https://en.wikipedia.org/wiki/Net_promoter_score
- WAI-ARIA Radiogroup Role: https://www.w3.org/TR/wai-aria-1.2/#radiogroup
