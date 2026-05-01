# PhaseBanner

A small banner that signals a service is in alpha or beta and points to a feedback link, setting honest expectations for early users that the service is still changing.

The pattern was popularised by GOV.UK to flag that a service is being iterated on, so users know that things may move and that their feedback is wanted. The component is intentionally lightweight: a phase tag rendered as a `<strong>` next to short descriptive text supplied by the consumer (typically containing a feedback link). It has no `role="alert"` semantics — phase status is meta-information about the service, not an interruption — but consumers can promote it to a landmark by adding `role="region"` + `aria-label` if their layout calls for it.

For service-wide announcements that aren't about development phase, use `AnnouncementBanner`. For ad-hoc top-of-page banners, use `Banner`.

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
