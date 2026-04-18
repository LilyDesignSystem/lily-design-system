# Footer

A footer is a semantic page landmark located at the bottom of a web page or section, typically used to provide secondary navigation, legal information, contact details, and links to important but less prominent content like privacy policies, terms of service, or social media profiles.

The component uses the native `<footer>` element, which is automatically recognized by assistive technologies as the `contentinfo` landmark role. An optional `aria-label` can distinguish multiple footers on the same page (e.g., a page footer vs. a section footer).

## Implementation Notes

- Renders a semantic `<footer>` element, which provides the `contentinfo` landmark role
- Supports an optional `aria-label` for distinguishing multiple footers on the same page
- Spreads `restProps` onto the `<footer>` element for consumer customization

## Props

- `label`: string (default: undefined) -- optional accessible name via `aria-label`, useful when multiple footers exist
- `children`: Snippet (required) -- footer content

## Usage

```svelte
<Footer label="Site footer">
  <p>Copyright 2024</p>
</Footer>
```

```svelte
<Footer>
  <nav aria-label="Footer navigation">
    <a href="/privacy">Privacy</a>
    <a href="/terms">Terms</a>
  </nav>
</Footer>
```

## Keyboard Interactions

None -- this component is a passive container. Keyboard interactions are determined by the consumer-provided child elements.

## ARIA

- `contentinfo` landmark role -- provided natively by the `<footer>` element, allowing screen reader users to navigate directly to the footer
- `aria-label` -- optional accessible name to distinguish this footer from others on the page
