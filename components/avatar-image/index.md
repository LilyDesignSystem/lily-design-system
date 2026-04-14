# Avatar Image

An avatar image is the `<img>` element rendered inside an Avatar when a valid image source is available. It displays the user's profile photo with proper `alt` text for accessibility and an `onerror` handler to trigger the initials fallback.

## Help

Use AvatarImage inside an Avatar to display a user's photo. The parent Avatar typically manages rendering this component automatically based on the `src` prop. Common scenarios include profile photos, team member headshots, and social media avatars.

## Syntax

```html
<AvatarImage src="..." alt="..." />
```

## Usage

Inside an Avatar with initials fallback:

```html
<Avatar alt="Dr Sarah Mitchell" initials="SM">
  <AvatarImage src="/photos/sarah-mitchell.jpg" alt="Dr Sarah Mitchell" />
</Avatar>
```

In a team member list:

```html
<Avatar alt="Nurse James Lee" initials="JL">
  <AvatarImage src="/photos/james-lee.jpg" alt="Nurse James Lee" />
</Avatar>
```

## Props

| Prop           | Type            | Default    | Description                                           |
| -------------- | --------------- | ---------- | ----------------------------------------------------- |
| `src`          | `string`        | (required) | URL of the avatar image                               |
| `alt`          | `string`        | (required) | Accessible alt text for the image                     |
| `...restProps` | HTML attributes |            | Additional attributes spread onto the `<img>` element |

## Examples

With custom sizing:

```html
<AvatarImage src="/photo.jpg" alt="Jane Doe" width="48" height="48" />
```

## Keyboard Interactions

- None -- this is a decorative/informational element, not interactive

## ARIA

- Native `<img>` element with `alt` text provides accessible image semantics
- When inside an Avatar, the parent's `aria-label` provides the primary accessible name
## When to Use

- Use inside Avatar to display a user's profile photo or image when a valid source is available.
- Use when the avatar should show a recognisable photo rather than initials for stronger visual identification.
- Use with a meaningful `alt` attribute so the image is accessible to screen readers.

## When Not to Use

- Do not use outside Avatar for general-purpose images -- use Image instead.
- Do not use without an `alt` attribute -- the image must have accessible alternative text.
- Do not use when no image is available -- let Avatar fall back to AvatarText with initials.

## Headless

This component provides a semantic `<img>` element with `alt` text and zero visual styling. The consumer is responsible for all CSS including sizing, circular clipping (border-radius), object-fit behavior, and any border or shadow effects.


## Styles

The consumer provides all CSS styling. The component renders with a `.avatar-image` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<img>` element with class `avatar-image`
- Verify When inside an Avatar, the parent's `aria-label` provides the primary accessible name
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Ensure avatar images are cropped and centered on the face. Provide a consistent size across all avatar instances in a given context.
- **Developers**: When inside an Avatar parent, the parent's `aria-label` provides the primary accessible name, so the `alt` text on the image serves as supplementary context.

## Composition

AvatarImage is a child component within the Avatar composition pattern:

- **Avatar** -- outer container with `role="img"` and `aria-label`.
- **AvatarImage** -- `<img>` element for the user's photo.
- **AvatarText** -- `<span>` fallback for initials when the image is unavailable.

```html
<Avatar alt="Jane Doe" initials="JD">
  <AvatarImage src="/photo.jpg" alt="Jane Doe" />
</Avatar>
```

## References

- HTML img element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img
- WAI-ARIA Img Role: https://www.w3.org/TR/wai-aria-1.2/#img
