# FeatureCard

## Metadata

- Component: feature-card
- PascalCase: FeatureCard
- Description: a large content card with a prominent image positioned alongside or above the text
- HTML tag: <article>
- CSS class: .feature-card
- Interactive: no (passive container; interactive children manage their own behavior)

## Key Behaviors

- Uses an <article> element to declare a self-contained composition
- heading is REQUIRED and renders inside <header> as an <h3> with class feature-card-heading
- imagePosition exposed as data-image-position ("start" | "end" | "top", default "start")
- imageUrl and imageAlt are optional; <img> renders only when imageUrl is provided
- description renders inside <p class="feature-card-description"> when provided
- label overrides implicit accessible name; defaults to heading
- Children render after the description for additional content (CTAs)

## ARIA

- Implicit `article` semantics from the <article> element
- aria-label provides the accessible name (defaults to heading)
- Image alt attribute provides its accessible name; decorative images use empty alt

## Keyboard

- None on the card itself (passive container); interactive children manage their own keyboard behavior.

## Props

- `heading`: string (REQUIRED) -- card heading
- `imagePosition`: "start" | "end" | "top" (default: "start")
- `imageUrl`: string (optional)
- `imageAlt`: string (optional)
- `description`: string (optional) -- body text
- `label`: string (optional) -- aria-label override; defaults to heading
- `children`: slot (optional) -- additional content
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <article> element with class="feature-card"
- [ ] data-image-position reflects imagePosition prop, defaulting to "start"
- [ ] Heading renders inside <header> as <h3 class="feature-card-heading">
- [ ] <img class="feature-card-image"> renders only when imageUrl provided
- [ ] Description renders inside <p class="feature-card-description"> when provided
- [ ] aria-label defaults to heading, overridden by label prop when provided
- [ ] Children render after the description
- [ ] All user-facing strings come through props (i18n-ready)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .feature-card in css-style-sheet-template.css
- MDN <article>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article
- Mozilla Protocol Design System: https://protocol.mozilla.org/
