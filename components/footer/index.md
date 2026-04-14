# Footer

A footer is a semantic page landmark located at the bottom of a web page or section, typically used to provide secondary navigation, legal information, contact details, and links to important but less prominent content like privacy policies, terms of service, or social media profiles.

The component uses the native `<footer>` element, which is automatically recognized by assistive technologies as the `contentinfo` landmark role. An optional `aria-label` can distinguish multiple footers on the same page (e.g., a page footer vs. a section footer).

## Implementation Notes

- Renders a semantic `<footer>` element, which provides the `contentinfo` landmark role
- Supports an optional `aria-label` for distinguishing multiple footers on the same page
- Spreads `restProps` onto the `<footer>` element for consumer customization

## Props

- `label`: string (default: undefined) -- optional accessible name via `aria-label`, useful when multiple footers exist
- `children`: slot (required) -- footer content

## Usage

```html
<Footer>
  <nav aria-label="Support links">
    <ul>
      <li><a href="/accessibility">Accessibility statement</a></li>
      <li><a href="/contact">Contact us</a></li>
      <li><a href="/cookies">Cookies</a></li>
      <li><a href="/privacy">Privacy policy</a></li>
      <li><a href="/terms">Terms and conditions</a></li>
    </ul>
  </nav>
  <p>&copy; NHS England</p>
</Footer>
```

## Keyboard Interactions

None -- this component is a passive container. Keyboard interactions are determined by the consumer-provided child elements.

## ARIA

- `contentinfo` landmark role -- provided natively by the `<footer>` element, allowing screen reader users to navigate directly to the footer
- `aria-label` -- optional accessible name to distinguish this footer from others on the page

## When to Use

- Use at the bottom of every page of your website or service to provide essential meta-navigation.
- Use to include links to: accessibility statement, contact details, cookies policy, privacy policy, and terms and conditions.
- Use to display copyright or organisational information.
- Use with a consistent set of links across all pages so users always know where to find help.

## When Not to Use

- Do not use within a mobile app -- use the app's native navigation patterns instead.
- Do not use for primary navigation -- use Header or NavigationMenu for main site navigation.
- Do not use for page-specific actions -- Footer is for site-wide meta links only.

## Headless

This headless component provides a semantic `<footer>` element that automatically exposes the `contentinfo` landmark role to assistive technologies. The consumer provides all visual styling including layout, colors, typography, and spacing.


## Styles

The consumer provides all CSS styling. The component renders with a `.footer` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<footer>` element with class `footer`
- Verify aria-label` -- optional accessible name to distinguish this footer from others on the page
- Verify pass-through attributes are applied

## Advice

- **Designers**: Keep footer content organized with clear groupings (e.g., navigation links, legal text, social links). Use a visually distinct background to separate the footer from main content.
- **Developers**: When multiple footers exist on a page, provide the `label` prop to help screen reader users distinguish between them.
