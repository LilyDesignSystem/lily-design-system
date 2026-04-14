# Place

A place component displays information about a place, such as its name, address, description, and map or image. It is used in location directories, venue listings, and geographic references.

This headless component uses an `<article>` element for self-contained place content semantics.

## Implementation Notes

- Uses `<article>` element for self-contained place semantics
- `aria-label` describes the place for screen readers
- Contains slots for name, address, description, and image or map

## Props

- `label`: string (optional) -- accessible label for the place
- `children`: slot (required) -- place content
- `...restProps`: Any additional HTML attributes

## Usage

```html
<Place label="Riverside Clinic, 42 Thames Road, London">
  <h3>Riverside Clinic</h3>
  <address>42 Thames Road, London SE1 7PB</address>
  <p>Walk-in clinic open Monday to Friday, 08:00 to 18:00.</p>
  <TelLink href="tel:+442079876543">020 7987 6543</TelLink>
  <Image src="/maps/riverside-clinic.png" label="Map showing Riverside Clinic location" />
</Place>
```

```html
<Place label="Conference Room B, Level 3">
  <h3>Conference Room B</h3>
  <p>Level 3, East Wing</p>
  <p>Capacity: 20 people. Equipped with video conferencing.</p>
</Place>
```

## Keyboard Interactions

- None -- place components are informational, not interactive

## ARIA

- Implicit `article` role from `<article>` element
- `aria-label` -- describes the place for screen readers

## When to Use

- Use to display place information such as a clinic address, hospital location, or service area.
- Use when structured place data (name, address, description) needs semantic grouping.
- Use for venue listings, location directories, or geographic references.
- Use in combination with Image for maps or photos, and TelLink for contact numbers.

## When Not to Use

- Do not use for organisations -- use Organization instead.
- Do not use for events at a location -- use Event instead.
- Do not use for simple inline addresses -- use a plain `<address>` element instead.

## Headless

This component provides an `<article>` element with optional `aria-label`, with zero visual styling. The consumer is responsible for all CSS including layout, map placement, and typography.

## Styles

The consumer provides all CSS styling. The component renders with a `.place` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders an `<article>` element with class `place`
- Verify `aria-label` is applied when provided
- Verify child content is rendered correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Include location name, address, and a visual element (map or photo) for clear identification.
- **Developers**: Use the `label` prop to identify the place for screen readers. Use semantic `<address>` elements for postal addresses.
