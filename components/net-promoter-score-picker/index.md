# Net Promoter Score Picker

A Net Promoter Score (NPS) picker is a UI/UX component that allows users
to select a score from 0 to 10, representing their likelihood to recommend a
product, service, or organization. It is a widely used customer loyalty metric
developed by Fred Reichheld and Bain & Company. The component renders as a
fieldset with a radiogroup role containing 11 radio buttons, one for each score
value. Scores are typically categorized as Detractors (0-6), Passives (7-8),
and Promoters (9-10). This headless component provides the semantic structure
and accessibility features while allowing consumers to apply their own visual
styling.

## Implementation Notes

- Renders as `<fieldset role="radiogroup">` with 11 radio buttons (0-10)
- Each radio has `aria-label` with its numeric value for screen readers
- The `value` prop is two-way binding
- Default radio group name is "nps", customizable via `name` prop
- Radio values are strings ("0" through "10")

## Props

- `label`: string (required) -- accessible label for the radiogroup
- `value`: string (default: "") -- currently selected score, bindable
- `name`: string (default: "nps") -- name attribute for the radio group
- `...restProps`: Any additional HTML attributes spread onto the fieldset

## Usage

NPS survey question with endpoint labels:

```html
<p>How likely are you to recommend us to a friend or colleague?</p>
<NetPromoterScorePicker label="How likely are you to recommend us?" value={score}>
    <NetPromoterScorePickerButton value="0" label="0 - Not at all likely" onclick={handleClick} />
    <NetPromoterScorePickerButton value="1" label="1" onclick={handleClick} />
    <NetPromoterScorePickerButton value="2" label="2" onclick={handleClick} />
    <NetPromoterScorePickerButton value="3" label="3" onclick={handleClick} />
    <NetPromoterScorePickerButton value="4" label="4" onclick={handleClick} />
    <NetPromoterScorePickerButton value="5" label="5" onclick={handleClick} />
    <NetPromoterScorePickerButton value="6" label="6" onclick={handleClick} />
    <NetPromoterScorePickerButton value="7" label="7" onclick={handleClick} />
    <NetPromoterScorePickerButton value="8" label="8" onclick={handleClick} />
    <NetPromoterScorePickerButton value="9" label="9" onclick={handleClick} />
    <NetPromoterScorePickerButton value="10" label="10 - Extremely likely" onclick={handleClick} />
</NetPromoterScorePicker>
<p>Selected score: {score}</p>
```

With a custom radio group name:

```html
<NetPromoterScorePicker label="Rate our service" value={score} name="service-nps" />
```

## Keyboard Interactions

- Arrow keys navigate between radio buttons (native radio group behavior)
- Space selects the focused radio button
- Tab moves focus into/out of the radio group

## ARIA

- `role="radiogroup"` on the fieldset
- `aria-label` on the fieldset from the label prop
- Each radio has `aria-label` with its numeric value

## When to Use

- Use to collect a Net Promoter Score (0-10) from users in feedback forms, surveys, or satisfaction questionnaires.
- Use when you need a standardized NPS input asking "How likely are you to recommend..." on a 0-10 scale.
- Use in customer loyalty surveys where Detractor/Passive/Promoter classification is needed.
- Use when the NPS metric will be reported and benchmarked against industry standards.

## When Not to Use

- Do not use for display-only NPS scores -- use NetPromoterScoreView instead.
- Do not use for general 1-5 numeric ratings -- use FiveStarRatingPicker.
- Do not use for satisfaction surveys with face labels -- use FiveFaceRatingPicker.
- Do not use for status indicators -- use RedAmberGreenPicker.

## Headless

This headless component provides a `<fieldset>` with `role="radiogroup"` containing 11 radio buttons (0-10) with `aria-label` on each. The consumer provides all visual styling, including button layout, color coding for Detractor/Passive/Promoter ranges, and selected-state appearance.


## Styles

The consumer provides all CSS styling. The component renders with a `.net-promoter-score-picker` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `net-promoter-score-picker`
- Verify role="radiogroup"` on the fieldset
- Verify aria-label` on the fieldset from the label prop
- Verify Each radio has `aria-label` with its numeric value
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Color-code the score ranges (0-6 Detractors, 7-8 Passives, 9-10 Promoters) and add endpoint labels such as "Not at all likely" and "Extremely likely".
- **Developers**: The `value` prop is two-way bindable and stores the selected score as a string ("0" through "10"). Use the `name` prop to differentiate multiple NPS pickers on one page.

## Composition

NetPromoterScorePicker is a compound component that can contain NetPromoterScorePickerButton children. The picker provides the radiogroup container, while each button represents one score value.

```
NetPromoterScorePicker (role="radiogroup") → NetPromoterScorePickerButton (0-10)
```

## References

- Net Promoter Score: https://en.wikipedia.org/wiki/Net_promoter_score
- WAI-ARIA Radiogroup Role: https://www.w3.org/TR/wai-aria-1.2/#radiogroup
