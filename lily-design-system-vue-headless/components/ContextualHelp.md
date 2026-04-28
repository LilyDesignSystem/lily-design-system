# ContextualHelp

A help button that opens a popover with explanatory content.

## Implementation Notes

- Headless: no CSS
- Trigger button has `aria-haspopup="dialog"`, `aria-expanded`, and `aria-controls`
- Panel has `role="dialog"` and is toggled with the native `hidden` attribute
- Panel id is generated for ARIA wiring

## Props

- `label`: string (**required**) — aria-label for the trigger
- `expanded`: boolean (default `false`)
- default slot — popover content

## Events

- `click(event: MouseEvent)` — trigger click

## Usage

```vue
<ContextualHelp label="Help" :expanded="open" @click="open = !open">
    <p>Explanatory help text here.</p>
</ContextualHelp>
```

## ARIA

- Trigger: `aria-label`, `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls`
- Panel: `role="dialog"`, has the id referenced by `aria-controls`
- Visibility: native `hidden` attribute when `expanded` is `false`

## When to Use

- For inline contextual help next to fields, headings, or controls

## When Not to Use

- For onboarding tips — use `Coachmark`
- For long-form help — link to dedicated documentation

## Headless

Renders semantic HTML and ARIA only. Consumers supply CSS for placement and styling of the popover panel.

## Testing

- Verify root `contextual-help` class
- Verify the trigger has the correct ARIA attributes
- Verify `aria-controls` matches the panel id
- Verify the panel toggles via the `hidden` attribute
- Verify `click` event fires on the trigger

## References

- [Adobe Spectrum — Contextual Help](https://spectrum.adobe.com/page/contextual-help/)
- [WAI-ARIA Disclosure Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)
