# Details

A disclosure widget that reveals or hides additional content on demand. Built on the native HTML `<details>` and `<summary>` elements, this component provides progressive disclosure -- showing only what is necessary upfront and letting users expand sections for more information. Common use cases include FAQs, collapsible sections, advanced options, and supplementary explanations.

The native `<details>` element provides built-in accessibility support without requiring custom ARIA attributes. Screen readers automatically announce the expanded or collapsed state. The component exposes a bindable `open` prop so parent components can programmatically control or react to the disclosure state.

## Implementation Notes

- Renders native `<details>` and `<summary>` HTML elements for built-in browser accessibility
- Supports two-way binding on the `open` prop for two-way state synchronization on the `open` prop
- The `summary` prop provides the clickable toggle text
- Accepts a `children` slot for the expandable content area
- Spreads `restProps` onto the `<details>` element for consumer customization
- Similar to Collapsible but uses a more generic, standards-based API

## Props

- `summary`: string (required) -- text displayed in the summary toggle
- `open`: boolean (default: false) -- whether the details section is expanded; bindable
- `children`: slot (required) -- content revealed when expanded

## Usage

```html
<Details summary="Why are we asking about your ethnicity?">
  <p>We ask about ethnicity to help ensure services are meeting the
  needs of all communities. This information is optional and will
  not affect your care.</p>
</Details>
```

```html
<Details summary="How to find your NHS number">
  <p>Your NHS number is a 10-digit number, like 485 777 3456.</p>
  <p>You can find it on any letter the NHS has sent you, on a
  prescription, or by logging in to your GP surgery's online services.</p>
</Details>
```

## Keyboard Interactions

- Enter or Space: toggles the disclosure open/closed when the `<summary>` element is focused (native browser behavior)

## ARIA

- Native `<details>` and `<summary>` elements provide built-in ARIA semantics
- The browser automatically exposes the expanded/collapsed state to assistive technology
- No additional ARIA attributes are needed because the native elements handle accessibility

## When to Use

- Use to make a page easier to scan by hiding supplementary information that only some users need
- Use to provide contextual help within forms, such as "Why are we asking this question?"
- Use when the summary text clearly indicates what information is hidden beneath
- Use for secondary guidance that supports but is not essential to the main content

## When Not to Use

- Do not use to hide information that the majority of users need — keep essential content visible
- Do not use when the hidden content is critical for task completion — it may be missed
- Do not use when you need more visual prominence for the expandable content — use Expander instead
- Do not use in transactional forms where users may fear clicking will lose their progress — consider showing the information inline

## Headless

This headless component provides native `<details>` and `<summary>` elements with built-in browser accessibility, including automatic expanded/collapsed state announcements. It supports two-way binding on the `open` prop. The consumer provides all visual styling for the summary toggle and expanded content area.


## Styles

The consumer provides all CSS styling. The component renders with a `.details` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<details>` element with class `details`
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Make the summary text descriptive enough that users understand what content will be revealed. Use visual cues (such as a chevron icon) to indicate expandability.
- **Developers**: Use the bindable `open` prop to synchronize state with parent components. Avoid nesting multiple levels of Details deeply, as it can create confusing navigation.

## References

- MDN details element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details
- MDN summary element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/summary
- WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/disclosure/
