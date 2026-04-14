# Person

A person component displays information about a person, such as their name, avatar, role, and contact details. It is used in team pages, directories, profiles, and user listings.

This headless component uses an `<article>` element for self-contained person content semantics.

## Implementation Notes

- Uses `<article>` element for self-contained person semantics
- `aria-label` describes the person for screen readers
- Contains slots for avatar, name, role, bio, and contact information

## Props

- `label`: string (optional) -- accessible label for the person
- `children`: slot (required) -- person content
- `...restProps`: Any additional HTML attributes

## Usage

```html
<Person label="Dr Sarah Chen, Consultant Cardiologist">
  <AvatarImage src="/photos/sarah-chen.jpg" label="Dr Sarah Chen" />
  <h3>Dr Sarah Chen</h3>
  <p>Consultant Cardiologist</p>
  <p>Cardiology Department, St James's Hospital</p>
  <EmailLink href="mailto:s.chen@stjames.nhs.uk">s.chen@stjames.nhs.uk</EmailLink>
  <TelLink href="tel:+442071234567">020 7123 4567</TelLink>
</Person>
```

```html
<Person label="Alex Morgan, Software Engineer">
  <AvatarText>AM</AvatarText>
  <h3>Alex Morgan</h3>
  <p>Software Engineer</p>
  <p>Building accessible design systems and component libraries.</p>
</Person>
```

## Keyboard Interactions

- None -- person components are informational, not interactive

## ARIA

- Implicit `article` role from `<article>` element
- `aria-label` -- describes the person for screen readers

## When to Use

- Use to display person-related information such as a patient, clinician, or contact.
- Use when structured person data (name, role, contact details) needs semantic grouping.
- Use for team member listings, staff directories, or user profile cards.
- Use when a person's information should be self-contained and reusable across contexts.
- Use in combination with Avatar, EmailLink, and TelLink for rich person displays.

## When Not to Use

- Do not use for simple avatar display -- use Avatar instead.
- Do not use for organisations -- use Organization instead.
- Do not use for plain text mentions of a person's name -- use a paragraph or inline text.
- Do not use for user authentication status -- use a dedicated auth indicator.

## Headless

This component provides an `<article>` element with optional `aria-label`, with zero visual styling. The consumer is responsible for all CSS including layout, avatar placement, and typography.

## Styles

The consumer provides all CSS styling. The component renders with a `.person` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders an `<article>` element with class `person`
- Verify `aria-label` is applied when provided
- Verify child content is rendered correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use consistent layouts across person entries. Include avatar, name, and role prominently.
- **Developers**: Use the `label` prop to identify the person for screen readers.
