# PhaseBanner

A banner showing service development phase and inviting feedback.

## Implementation Notes

- Renders a `<div>` with an embedded phase tag (e.g. "Alpha", "Beta") and a feedback link
- The phase tag is rendered as a `<strong>` so it is semantically emphasised
- Children slot is reserved for the descriptive text (often containing the feedback link)
- Renders no role by default — the banner is meta-information about the service, not a landmark
- Spreads `restProps` onto the root `<div>` for consumer customization

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `phase` | string (required) | — | Phase label, e.g. "Alpha", "Beta", "Live" |
| `children` | slot (required) | — | Descriptive text and feedback link |
| `...restProps` | HTML attributes | — | Spread onto the root `<div>` |

## Usage

```html
<PhaseBanner phase="Beta">
  This is a new service – your <a href="/feedback">feedback</a> will help us improve it.
</PhaseBanner>
```

## Keyboard Interactions

- Native anchor keyboard behaviour applies for any feedback link inside the banner

## ARIA

- Native semantics — no special ARIA needed
- Consumers may add `role="region"` + `aria-label` if they treat this banner as a landmark

## When to Use

- Indicating that a service is in alpha or beta and inviting feedback from early users
- Communicating that a service is iterating quickly and may change

## When Not to Use

- Use `AnnouncementBanner` for service-wide messages unrelated to development phase
- Use `Banner` for general-purpose top-of-page banners

## Headless

This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.

## Styles

The component renders with `.phase-banner` as the root class. No default styles are included.

## Related components

- `announcement-banner` — service-wide messages
- `banner` — generic top banner
- `status-tag` — single-element status indicator

## References

- [GOV.UK Phase banners pattern](https://design-system.service.gov.uk/components/phase-banner/)
