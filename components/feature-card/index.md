# Feature Card

A feature card is a large content card that pairs a prominent image with a
heading, optional description, and optional calls-to-action. The image can
be positioned at the start, end, or top of the card to create varied
editorial layouts.

Use it for marketing pages, product feature highlights, blog post previews,
program announcements, and other compositions that benefit from a strong
visual paired with rich text.

## Implementation Notes

- Uses an `<article>` element to declare a self-contained composition
- `heading` is **required** and renders inside `<header>` as an `<h3>`
- `imagePosition` is exposed as `data-image-position` so consumer CSS can lay out start/end/top variants
- `imageUrl` and `imageAlt` are optional; the image renders only when both are useful
- `label` overrides the implicit accessible name; defaults to `heading`
- `children` render after the description for arbitrary additional content (CTAs, badges)

## Props

- `heading`: string (**required**) -- card heading
- `imagePosition`: "start" | "end" | "top" (default: "start") -- image placement
- `imageUrl`: string (optional) -- image source
- `imageAlt`: string (optional) -- image alt text
- `description`: string (optional) -- body text
- `label`: string (optional) -- aria-label override; defaults to heading
- `children`: slot (optional) -- additional content (e.g., CTAs)
- `...restProps`: any additional HTML attributes

## Usage

Basic feature card with image start:

```html
<FeatureCard
  heading="Privacy first"
  description="We protect your data with end-to-end encryption."
  imageUrl="/images/privacy.jpg"
  imageAlt="Padlock illustration"
>
  <a href="/privacy">Learn more</a>
</FeatureCard>
```

Image at the top:

```html
<FeatureCard
  heading="Open by design"
  imagePosition="top"
  imageUrl="/images/open.jpg"
  imageAlt="Open lock illustration"
  description="Built on open standards from day one."
/>
```

## Keyboard Interactions

- None on the card itself (passive container); interactive children manage their own keyboard behavior.

## ARIA

- Implicit `article` semantics from the `<article>` element
- `aria-label` provides the accessible name (defaults to `heading`)
- The image's `alt` attribute provides its accessible name; decorative images can pass an empty `alt`

## When to Use

- Use to highlight a single feature, story, or product capability with image and text together.
- Use in marketing layouts, pricing pages, and program landing pages.
- Use when the image is informative or strongly enhances the message.

## When Not to Use

- Do not use for compact list items — use Card or Tile.
- Do not use for navigation tiles — consider a tile with a single link inside.
- Do not omit `imageAlt` for non-decorative images.

## Headless

Renders an `<article>` with optional `<img>`, a `<header>` containing the
heading, an optional `<p>` description, and any children. Layout (image
side, image-on-top, responsive flow) is the consumer's responsibility, with
`data-image-position` available as a hook.

## Styles

Consumer CSS targets the `feature-card` class. Use the
`data-image-position="start"`, `data-image-position="end"`, and
`data-image-position="top"` attribute selectors to lay out variants. Style
the inner `feature-card-image`, `feature-card-header`, `feature-card-heading`,
and `feature-card-description` classes as needed.

## Testing

- Verify the component renders an `<article>` element with class `feature-card`
- Verify `data-image-position` reflects the `imagePosition` prop (defaulting to `start`)
- Verify the heading is rendered inside `<header>` as an `<h3>` with class `feature-card-heading`
- Verify the `<img>` renders only when `imageUrl` is provided
- Verify the description is rendered inside `<p class="feature-card-description">` when provided
- Verify `aria-label` defaults to `heading` and can be overridden by `label`
- Verify children render after the description

## Advice

- **Designers**: Keep the image meaningful and high-contrast. Match the heading hierarchy to surrounding content (most pages should use `<h3>` for cards inside an `<h2>` section).
- **Developers**: Always provide `imageAlt` (use an empty string for decorative imagery). Render CTAs as children so the consumer can swap link/button styles per surface.

## Related components

- `card` — a grouped content container with header, body, and footer areas
- `hero` — a large box or image with a title and description
- `call-to-action` — a prominent prompt encouraging user action

## References

- MDN `<article>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article
- WAI-ARIA `article` role: https://www.w3.org/TR/wai-aria-1.2/#article
- Mozilla Protocol Design System: https://protocol.mozilla.org/

---

Lily™ and Lily Design System™ are trademarks.
