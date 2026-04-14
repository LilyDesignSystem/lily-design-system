# Hint

A hint provides subtle, contextual guidance text associated with a form control. It is typically displayed near an input field to clarify expected formats, explain functionality, or offer examples. The component renders a `<p>` element with an optional `id` for linking to a form control via `aria-describedby`.

This component is designed to work alongside form inputs where the consumer links the hint to the input using `aria-describedby` on the input element pointing to the hint's `id`. This ensures screen readers announce the hint text when the user focuses the associated input.

## Implementation Notes

- Renders a `<p>` element containing the children slot
- Accepts an optional `id` prop for `aria-describedby` linking with form controls
- Spreads `restProps` onto the `<p>` for consumer customization
- The consumer is responsible for adding `aria-describedby` to the associated input

## Props

- `id`: string (default: undefined) -- ID for linking via `aria-describedby` on the associated form control
- `children`: slot (required) -- hint text content

## Usage

```html
<Field label="What is your NHS number?">
  <Hint id="nhs-number-hint">This is a 10-digit number, like 485 777 3456. You can find it on any letter the NHS has sent you.</Hint>
  <TextInput label="NHS number" inputmode="numeric" aria-describedby="nhs-number-hint" />
</Field>
```

```html
<Field label="Email address">
  <Hint id="email-hint">We will only use this to send you a confirmation</Hint>
  <EmailInput label="Email address" aria-describedby="email-hint" />
</Field>
```

```html
<Field label="Date of birth">
  <Hint id="dob-hint">For example, 15 3 1984</Hint>
  <DateInput label="Date of birth" aria-describedby="dob-hint" />
</Field>
```

## Keyboard Interactions

None -- this component is a passive text element. It is announced by screen readers when the associated form control receives focus.

## ARIA

- `id={id}` -- provides a target for `aria-describedby` on the associated form control

## When to Use

- Use to help the majority of users understand how to answer a form question
- Use to show the expected format of an answer, such as "For example, 15 3 1984" or "Like name@example.com"
- Use to explain where users can find the information being asked for
- Use as a single short phrase or sentence -- keep it concise because screen readers read the entire hint aloud

## When Not to Use

- Do not use for long, detailed explanations -- screen readers read the entire hint aloud, which frustrates users; use InformationCallout instead
- Do not include links inside hint text -- screen readers do not announce that hint text contains a link
- Do not include interactive elements like Details inside hint text -- users in screen reader form mode cannot interact with them
- Do not use as a substitute for a clear Label -- the label should make the question understandable on its own
- Do not use for error messages -- use ErrorMessage instead

## Headless

This headless component provides a `<p>` element with an optional `id` for linking to a form control via `aria-describedby`. The consumer provides all visual styling including font size, color, spacing, and position relative to the input.


## Styles

The consumer provides all CSS styling. The component renders with a `.hint` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<span>` element with class `hint`
- Verify pass-through attributes are applied

## Advice

- **Designers**: Place hint text directly below the label and above the input. Use a lighter color or smaller font to distinguish it from labels and error messages.
- **Developers**: Always set the `id` prop and add `aria-describedby` to the associated input so screen readers announce the hint when the input is focused.

## References

- WAI Forms Tutorial - Instructions: https://www.w3.org/WAI/tutorials/forms/instructions/
