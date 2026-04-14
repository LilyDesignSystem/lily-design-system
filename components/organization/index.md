# Organization

An organization component displays information about an organization, such as its name, logo, description, and contact details. It is used in directories, profiles, and listings.

This headless component uses an `<article>` element for self-contained organization content semantics.

## Implementation Notes

- Uses `<article>` element for self-contained organization semantics
- `aria-label` describes the organization for screen readers
- Contains slots for name, logo, description, and contact information

## Props

- `label`: string (optional) -- accessible label for the organization
- `children`: slot (required) -- organization content
- `...restProps`: Any additional HTML attributes

## Usage

```html
<Organization label="St James's Hospital, Cardiology Department">
  <Image src="/logos/stjames.png" label="St James's Hospital logo" />
  <h3>St James's Hospital</h3>
  <p>Cardiology Department</p>
  <address>Beckett Way, Leeds LS9 7TF</address>
  <TelLink href="tel:+441234567890">0123 456 7890</TelLink>
  <EmailLink href="mailto:info@stjames.nhs.uk">info@stjames.nhs.uk</EmailLink>
</Organization>
```

```html
<Organization label="Acme Software Ltd">
  <h3>Acme Software Ltd</h3>
  <p>Enterprise solutions for healthcare integration and interoperability.</p>
  <a href="https://acme.example.com">acme.example.com</a>
</Organization>
```

## Keyboard Interactions

- None -- organizations are informational, not interactive

## ARIA

- Implicit `article` role from `<article>` element
- `aria-label` -- describes the organization for screen readers

## When to Use

- Use to display organisation information such as a hospital, clinic, department, or company.
- Use when structured organisation data (name, logo, contact details) needs semantic grouping.
- Use for provider directories, partner listings, or department profiles.
- Use in combination with Image, EmailLink, and TelLink for rich organisation displays.

## When Not to Use

- Do not use for people -- use Person instead.
- Do not use for locations without organisation context -- use Place instead.
- Do not use for plain text mentions of an organisation name -- use a paragraph or inline text.

## Headless

This component provides an `<article>` element with optional `aria-label`, with zero visual styling. The consumer is responsible for all CSS including layout, logo placement, and typography.

## Styles

The consumer provides all CSS styling. The component renders with an `.organization` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders an `<article>` element with class `organization`
- Verify `aria-label` is applied when provided
- Verify child content is rendered correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use consistent layouts across organization entries. Include logo, name, and key details prominently.
- **Developers**: Use the `label` prop to identify the organization for screen readers.
