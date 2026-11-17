# RangeFieldset

## Metadata

- Component: range-fieldset
- PascalCase: RangeFieldset
- Description: a fieldset of two range inputs for a minimum and a maximum that cannot cross
- Status: experimental — new, implemented and unit-tested in every headless library; not yet exercised in a composed flow
- HTML tag: <fieldset>
- CSS class: .range-fieldset
- Interactive: yes

## Key Behaviors

- Renders `<fieldset class="range-fieldset">` with a `<legend class="range-fieldset-legend">` and two native `<input type="range">`: `.range-fieldset-minimum` and `.range-fieldset-maximum`
- Both inputs share one scale (`min` to `max`, `step`), so the consumer's CSS can lay them over one track and draw the span between them
- The thumbs cannot cross: a thumb moved past the other stops where the other is, by keyboard or pointer
- Each value is its own form field (`minimumName`, `maximumName`); a form reset puts both thumbs back
- `disabled` disables the fieldset, and so both thumbs
- In HTML and Nunjucks the clamp is the consumer's script; without script the values can cross, so the server takes the lower as the minimum
- Accepts `...restProps` for forwarding additional attributes to the fieldset

## ARIA

- The `<legend>` names the group
- `aria-label={minimumLabel}` and `aria-label={maximumLabel}` name the thumbs
- The native range inputs carry the slider role and announce their values

## Keyboard

- Tab: Move from the lower thumb to the upper thumb
- Left Arrow / Down Arrow: Decrease the focused thumb by one step
- Right Arrow / Up Arrow: Increase the focused thumb by one step
- Home: Move the focused thumb to its lowest value (the upper thumb stops at the lower one)
- End: Move the focused thumb to its highest value (the lower thumb stops at the upper one)
- Page Up / Page Down: Move the focused thumb by a larger step

## Props

- `legend`: string (required) -- the visible name of the whole range
- `minimumLabel`: string (required) -- accessible name of the lower thumb
- `maximumLabel`: string (required) -- accessible name of the upper thumb
- `minimum`: number (default: `min`) -- the lower value; bindable
- `maximum`: number (default: `max`) -- the upper value; bindable
- `min`: number (default: 0) -- the lowest value either thumb can take
- `max`: number (default: 100) -- the highest value either thumb can take
- `step`: number (default: 1) -- the increment of both thumbs
- `minimumName`: string (optional) -- form field name of the lower value
- `maximumName`: string (optional) -- form field name of the upper value
- `disabled`: boolean (default: false) -- disables both thumbs
- `onchange`: (minimum, maximum) => void (optional) -- called when either value changes
- `...restProps`: unknown -- additional attributes spread onto the `<fieldset>`

## Acceptance Criteria

- [x] Renders <fieldset> with class="range-fieldset", a legend and two range inputs on one scale
- [x] The thumbs cannot cross
- [x] Both values submit as their own form fields
- [x] A form reset restores both thumbs
- [ ] WCAG 2.2 AAA compliant
- [x] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .range-fieldset in css-style-sheet-template.css
- WAI-ARIA APG, Multi-Thumb Slider: https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/
- MDN input type="range": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range
- Spec: spec/lessons/retool/index.md
