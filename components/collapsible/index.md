# Collapsible

A collapsible (disclosure) component allows users to expand or collapse a section of content. Built on the native HTML `<details>` and `<summary>` elements, it provides built-in keyboard support and screen reader announcements without any JavaScript.

The summary text is always visible and acts as the toggle trigger. The content below is hidden when collapsed and revealed when expanded. The `open` prop is bindable, enabling parent components to programmatically control or observe the expanded/collapsed state.

## Implementation Notes

- Uses native `<details>` and `<summary>` elements for built-in accessibility support
- The `open` prop uses two-way binding
- No custom ARIA attributes needed because native elements handle all announcements
- Spreads `restProps` onto the `<details>` element for consumer customization

## Props

- `summary`: string (required) -- the clickable summary text shown as the toggle trigger
- `open`: boolean (default: false) -- whether the content is expanded; bindable for two-way control
- `children`: slot (required) -- the collapsible content revealed when expanded

## Usage

Basic collapsible section:

```html
<Collapsible summary="More info">
  <p>Hidden content revealed on expand.</p>
</Collapsible>
```

Programmatically controlled collapsible for advanced settings:

```html
<Collapsible summary="Advanced settings" open={showAdvanced}>
  <label for="timeout">Timeout (seconds)</label>
  <NumberInput label="Timeout" id="timeout" value={timeout} min={1} max={300} />
  <label for="retries">Max retries</label>
  <NumberInput label="Max retries" id="retries" value={retries} min={0} max={10} />
</Collapsible>
```

FAQ page with multiple collapsible sections:

```html
<h2>Frequently Asked Questions</h2>
<Collapsible summary="How do I reset my password?">
  <p>Go to the login page and click "Forgot password". Enter your email address and follow the instructions sent to your inbox.</p>
</Collapsible>
<Collapsible summary="Can I change my username?">
  <p>Yes. Navigate to Settings > Profile and update your display name.</p>
</Collapsible>
<Collapsible summary="What payment methods do you accept?">
  <p>We accept Visa, Mastercard, and bank transfers.</p>
</Collapsible>
```

## Keyboard Interactions

- Enter/Space: Toggle the disclosure open/closed (handled natively by `<summary>`)

## ARIA

- No custom ARIA attributes required -- native `<details>`/`<summary>` elements provide built-in expanded/collapsed state announcements to screen readers

## When to Use

- Use to hide secondary content that users may optionally expand, such as advanced settings, additional details, or FAQ answers.
- Use to reduce visual clutter on content-heavy pages while keeping information accessible.
- Use as a programmatically controlled container where open/close state is driven by application logic.
- Use for progressive disclosure in long forms or configuration panels.

## When Not to Use

- Do not use for user-triggered disclosure with a visible toggle -- use Details or Expander instead.
- Do not use for navigation hierarchies -- use AccordionNav or TreeNav instead.
- Do not use for critical content that all users must see -- keep essential information visible by default.

## Headless

This headless Collapsible component provides native `<details>` and `<summary>` elements with built-in keyboard support and screen reader announcements, plus a bindable `open` prop for programmatic control. The consumer provides all visual styling including summary appearance, expand/collapse icons, transition animations, and content padding.


## Styles

The consumer provides all CSS styling. The component renders with a `.collapsible` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `collapsible`
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Include a clear visual indicator (such as a chevron or plus/minus icon) showing whether the section is expanded or collapsed. Ensure the summary text clearly describes the hidden content.
- **Developers**: Use the bindable `open` prop to programmatically control or observe the expanded state. The native `<details>` element handles all accessibility announcements automatically.

## References

- WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/disclosure/
