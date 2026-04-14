# Hero

A hero is a large, prominent section typically placed at the top of a page, featuring a title, description, and optionally a background image or call-to-action. Heroes are used to create a strong visual introduction and draw attention to key content.

This headless component uses a `<section>` element with an `aria-label` to create a labeled landmark region for the hero content.

## Implementation Notes

- Uses `<section>` element for landmark semantics
- `aria-label` describes the hero section for screen readers
- Contains slots for title, description, image, and call-to-action
- Consumer controls the visual presentation via CSS

## Props

- `label`: string (required) -- accessible label for the hero section
- `children`: slot (required) -- hero content including title, description, and CTA
- `...restProps`: Any additional HTML attributes

## Usage

```html
<Hero label="Welcome to our platform">
  <h1>Build Something Amazing</h1>
  <p>The fastest way to create beautiful, accessible web applications.</p>
  <Button>Get Started</Button>
</Hero>
```

```html
<Hero label="Register for a GP">
  <h1>Register with a GP surgery</h1>
  <p>Everyone in England can register with a GP surgery. It is free to register.</p>
  <ActionLink href="/register">Register now</ActionLink>
</Hero>
```

```html
<Hero label="Lily Design System">
  <h1>Lily Design System</h1>
  <p>Headless, accessible components for healthcare and government services.</p>
  <Button>View components</Button>
  <Button>Read the docs</Button>
</Hero>
```

## Keyboard Interactions

- None at the section level -- interactive children handle their own keyboard interactions

## ARIA

- Implicit `region` role from `<section>` element with `aria-label`
- `aria-label` -- describes the hero section for screen readers

## When to Use

- Use at the top of a landing page to introduce the service with a prominent heading, description, and optional background image
- Use when you need a large visual introduction that sets the context for the page
- Use on marketing or public-facing pages where a strong first impression matters
- Use to combine a headline, supporting text, and a primary call-to-action in a single prominent section

## When Not to Use

- Do not use on transactional pages -- keep forms focused without large visual elements
- Do not use multiple heroes on one page -- use Card or Panel for secondary content blocks
- Do not use for repeated content sections within a page -- use Card, Tile, or Panel instead

## Headless

This component provides a `<section>` element with `aria-label` for landmark navigation, with zero visual styling. The consumer is responsible for all CSS including background image, overlay, text alignment, padding, responsive sizing, and CTA button placement.

## Styles

The consumer provides all CSS styling. The component renders with a `.hero` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<section>` element with class `hero`
- Verify `aria-label` is applied
- Verify child content slots are rendered correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Keep hero content concise and focused. Use high-contrast text over images. Ensure text is readable at all viewport sizes. Include a clear call-to-action.
- **Developers**: Always provide a descriptive `label` prop for screen reader landmark navigation. Use responsive images and consider lazy loading for hero backgrounds.
