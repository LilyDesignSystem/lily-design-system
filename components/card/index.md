# Card

A card groups related content and actions into a self-contained semantic container, making it easy to browse and compare items. Cards are commonly used for product listings, user profiles, article previews, media galleries, and dashboard widgets. They present a digestible summary of information that can include headings, text, and interactive elements.

The component renders as an `<article>` element for standalone content grouping. It supports a configurable heading level (h2-h6) for proper document outline, and the heading can optionally be wrapped in a link when an `href` is provided. An optional `aria-label` enables the article to be identified as a named landmark.

## Implementation Notes

- Uses `<article>` for semantic standalone content grouping
- Heading level is configurable (2-6) for proper document outline structure
- When `href` is provided, the heading text wraps in an `<a>` element for navigation
- Optional `aria-label` for named landmark identification
- Content is provided through child elements
- Passes through all additional HTML attributes via `...restProps`

## Props

- `heading`: string (optional) -- heading text for the card
- `headingLevel`: 2 | 3 | 4 | 5 | 6 (default: 3) -- HTML heading level
- `href`: string (optional) -- makes the heading a link
- `label`: string (optional) -- `aria-label` for the article
- `children`: slot (required) -- card body content
- `...restProps`: Any additional HTML attributes passed to the `<article>` element

## Usage

Card with linked heading for a condition page:

```html
<Card heading="Diabetes" headingLevel={2} href="/conditions/diabetes">
  <p>Find out about type 1 and type 2 diabetes, including symptoms,
  diagnosis, and how to manage the condition.</p>
</Card>
```

Card with action link for a profile:

```html
<Card heading="Dr Sarah Mitchell" label="GP profile">
  <p>General Practitioner</p>
  <p>Special interests: cardiology, respiratory medicine</p>
  <ActionLink href="/book/dr-mitchell">Book an appointment</ActionLink>
</Card>
```

## Keyboard Interactions

- Tab: Focus the heading link when `href` is provided
- Enter: Activate the heading link (browser default)

## ARIA

- Implicit `article` role from the `<article>` element
- Optional `aria-label` -- identifies the card as a named landmark for screen readers

## When to Use

- Use to group related content such as a service listing, team member profile, or article preview into a scannable unit.
- Use when users need to browse and compare multiple items in a grid or list layout.
- Use when the content is self-contained and makes sense as a standalone summary.
- Use the `href` prop to make the card heading a link when the card leads to a detail page.

## When Not to Use

- Do not use to highlight content within long-form pages -- use InsetText or WarningCallout instead.
- Do not use for medical care instructions with urgency levels -- use CareCard instead.
- Do not use for single full-width content sections -- use Panel or a plain section element.
- Do not use when content needs to be hidden/revealed -- use Details or Expander instead.

## Headless

This headless Card component provides the semantic `<article>` element, configurable heading level for document outline, optional heading link via `href`, and `aria-label` for landmark identification. The consumer provides all visual styling including card borders, shadows, spacing, background colors, and layout of header, body, and footer areas.


## Styles

The consumer provides all CSS styling. The component renders with a `.card` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `card`
- Verify Optional `aria-label` -- identifies the card as a named landmark for screen readers
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Keep card content concise and scannable. Use consistent card heights within a grid to maintain visual rhythm.
- **Developers**: Choose the heading level carefully to preserve the document outline hierarchy. Use the `label` prop when multiple cards appear on one page to help screen reader users distinguish between them.

## Composition

Card supports header, body, and footer content areas through its children slot. Structure the card content with a heading for the header area, paragraph or descriptive content for the body, and action links or buttons for the footer. The `heading` prop provides a built-in heading element, or consumers can supply their own heading as part of the children content.
