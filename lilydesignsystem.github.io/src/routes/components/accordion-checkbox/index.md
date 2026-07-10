# Accordion Checkbox

A compound disclosure widget that pairs a checkbox option with a revealable panel. The user sees a vertical list of checkbox options; checking a box reveals an accordion panel of additional content beneath that option. Common use cases include conditional follow-up questions, opt-in disclosures, and form sections that only apply once selected.

Unlike `Details`, which uses a `<summary>` toggle, this component uses a real form control. The checkbox state is the source of truth — `checked` controls whether the panel is visible. Multiple AccordionCheckbox instances can stack vertically to make a list of independent toggleable options.

## Implementation Notes

- Renders a `<div class="accordion-checkbox">` containing an `<input type="checkbox">`, its `<label>`, and a `<div class="accordion-checkbox-panel">` that is hidden when unchecked
- Auto-generates a unique id linking the checkbox (`<id>-checkbox`) and the panel (`<id>-panel`) so `aria-controls` and `<label for>` resolve correctly
- Sets `aria-controls` on the checkbox pointing at the panel and `aria-expanded` matching the checked state
- Sets `role="region"` and `aria-labelledby` on the panel so screen readers identify the revealed area as a labeled region
- Applies the native `hidden` attribute to the panel when unchecked so it is removed from the layout and the accessibility tree
- Supports two-way binding on the `checked` prop for parent components to control or react to the state
- Spreads `restProps` onto the root `<div>` for consumer customization

## Props

- `label`: string (required) — the checkbox label text
- `checked`: boolean (default: false) — whether the checkbox is checked and the panel is revealed; bindable
- `id`: string (optional) — base id for the checkbox/panel link; auto-generated if not provided
- `children`: slot (required) — content shown when the checkbox is checked

## Usage

```html
<AccordionCheckbox label="I have a follow-up question">
  <p>Tell us more in the text-area-input below.</p>
  <textarea aria-label="Your question"></textarea>
</AccordionCheckbox>
```

```html
<AccordionCheckbox label="Subscribe to optional updates" checked>
  <fieldset>
    <legend>Topics</legend>
    <label><input type="checkbox" name="topic" value="news"> News</label>
    <label><input type="checkbox" name="topic" value="events"> Events</label>
  </fieldset>
</AccordionCheckbox>
```

## Keyboard Interactions

- Tab: moves focus onto the checkbox
- Space: toggles the checkbox checked state, which reveals or hides the panel
- Native checkbox keyboard behavior applies; no custom handlers required

## ARIA

- `aria-controls` on the `<input>` references the panel id so assistive technology can navigate from the trigger to its target
- `aria-expanded` on the `<input>` reflects the checked state, so screen readers announce open/closed
- `role="region"` and `aria-labelledby` on the panel identify it as a labeled landmark region tied to the checkbox
- `hidden` on the panel removes it from the accessibility tree when unchecked

## When to Use

- Use when an option introduces follow-up content the user only needs to see if they opt in
- Use for conditional sections of forms (for example, "I have additional comments" → text-area-input)
- Use when stacking several independent opt-in disclosures vertically as a list
- Use when the trigger should be a real form control, so the value is part of form submission

## When Not to Use

- Do not use when the trigger is informational only — use `Details` (`<details>` / `<summary>`) instead
- Do not use to switch a setting on/off without revealing additional content — use `SwitchButton` or a plain `CheckboxInput`
- Do not use for mutually exclusive options — use `RadioGroup`
- Do not use when only one of many options can be expanded at a time — use `AccordionList` / `AccordionListItem`

## Headless

This headless component renders semantic HTML (`<div>` wrapping a `<label>` + `<input type="checkbox">` + revealable panel) with all required ARIA wiring. The consumer provides all visual styling — including spacing, indentation, focus rings, and any animation on the reveal.

## Styles

The consumer provides all CSS styling. The component renders with these class hooks:

- `.accordion-checkbox` on the root `<div>`
- `.accordion-checkbox-input` on the `<input type="checkbox">`
- `.accordion-checkbox-label` on the `<label>`
- `.accordion-checkbox-panel` on the revealable `<div>`

No default styles are included — this is a fully headless component.

## Testing

- Verify the root `<div>` has class `accordion-checkbox`
- Verify the checkbox toggles `aria-expanded` and the panel `hidden` attribute together
- Verify `aria-controls` on the checkbox matches the panel `id`
- Verify the panel content is in the accessibility tree only when checked
- Verify two-way binding on `checked` reflects parent state
- Verify keyboard activation via Space toggles the panel

## Advice

- **Designers**: Indicate that the option reveals more content (a chevron or "+/–" cue helps). Make sure the revealed panel is visually grouped with its trigger so the relationship is unambiguous.
- **Developers**: Keep the panel content lightweight; if it grows large, consider lazy rendering tied to the `checked` prop. Validate any inputs inside the panel only when the checkbox is checked.

## Related components

- `accordion-list` — an accordion ordered list of list item components
- `accordion-list-item` — an accordion list item component
- `details` — a disclosure widget that shows and hides content
- `switch-button` — a toggle switch for turning a setting on or off
- `checkbox-input` — a checkbox input for toggling a boolean value <input type="checkbox">

## References

- WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
- MDN input type=checkbox: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox
- MDN aria-controls: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-controls
- MDN hidden attribute: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/hidden

---

Lily™ and Lily Design System™ are trademarks.
