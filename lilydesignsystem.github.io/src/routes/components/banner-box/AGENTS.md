# BannerBox

## Metadata

- Component: banner-box
- PascalCase: BannerBox
- Description: a banner box that is inside a banner component, using flexbox horizontal
- HTML tag: <div>
- CSS class: .banner-box
- Interactive: no

## Key Behaviors

- Renders a `<div>` element intended to be placed inside a Banner component
- Provides a flexbox horizontal layout container for banner content
- Uses `display: flex` and `flex-direction: row` via the consumer's CSS targeting `.banner-box`
- Uses `children` slot for flexible content rendering
- Spreads `restProps` onto the `<div>` element for consumer extensibility

## ARIA

- No additional ARIA attributes required; the parent Banner provides the landmark role and aria-live region

## Keyboard

- None (passive layout element)

## Props

- `label`: string (optional) -- accessible name applied via `aria-label` if needed
- `children`: slot (required) -- the banner box content
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="banner-box"
- [ ] Works inside a Banner component
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## Composition

BannerBox is designed to be used inside a Banner:

```html
<Banner>
  <BannerBox>
    <span>Message text</span>
    <button>Action</button>
  </BannerBox>
</Banner>
```

## References

- Documentation: index.md
- CSS class: .banner-box in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/banner-box.html
- Parent component: Banner
