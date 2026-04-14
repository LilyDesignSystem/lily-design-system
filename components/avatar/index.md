# Avatar

An avatar circle is a component that displays a user's profile image or fallback initials within a circular frame, commonly used to represent a user identity in apps, websites, and social platforms. This visual element provides a quick, recognizable way for users to identify themselves or others, often appearing in headers, comments, chat interfaces, and account menus.

The component handles image loading gracefully: if an image source is provided, it renders an AvatarImage; if the image fails to load or no source is provided, it falls back to displaying the user's initials via AvatarText.

## Help

Use Avatar as the outer container for user avatars. It renders either an AvatarImage (when a photo is available) or an AvatarText (initials fallback). Common scenarios include user profiles, comment threads, chat interfaces, account menus, and team member lists.

## Syntax

```html
<Avatar alt="..." src="..." initials="..." />
```

## Usage

Avatar with image and initials fallback:

```html
<Avatar src="/photos/sarah-mitchell.jpg" alt="Dr Sarah Mitchell" initials="SM" />
```

Avatar with initials only (no photo available):

```html
<Avatar alt="Nurse James Lee" initials="JL" />
```

Avatar group showing a care team:

```html
<AvatarGroup label="Care team">
  <Avatar src="/photos/sarah-mitchell.jpg" alt="Dr Sarah Mitchell" initials="SM" />
  <Avatar alt="Nurse James Lee" initials="JL" />
  <Avatar alt="Dr Priya Sharma" initials="PS" />
</AvatarGroup>
```

## Props

| Prop           | Type            | Default    | Description                                                                                        |
| -------------- | --------------- | ---------- | -------------------------------------------------------------------------------------------------- |
| `src`          | `string`        | (optional) | URL of the avatar image                                                                            |
| `alt`          | `string`        | (required) | Accessible description of the person, used as `aria-label` on the container and `alt` on the image |
| `initials`     | `string`        | (optional) | Fallback text displayed when no image is available or the image fails to load                      |
| `...restProps` | HTML attributes |            | Additional attributes spread onto the outer `<span>` element                                       |

## Examples

Team member list:

```html
<Avatar src="/team/alice.jpg" alt="Alice Smith" initials="AS" />
<Avatar src="/team/bob.jpg" alt="Bob Jones" initials="BJ" />
<Avatar alt="Charlie Brown" initials="CB" />
```

## Keyboard Interactions

- None -- this is a decorative/informational component, not interactive

## ARIA

- `role="img"` -- on the outer container, conveying that the entire avatar is an image representation
- `aria-label` -- set from the `alt` prop, providing the accessible name for the avatar
- `aria-hidden="true"` -- on the inner initials `<span>`, preventing duplicate announcements since the outer element already has `aria-label`
## When to Use

- Use to display a user's visual identity, such as a profile photo or initials fallback, in headers, comment threads, chat messages, or contact lists.
- Use when you need graceful fallback from an image to initials when the photo is unavailable or fails to load.
- Use with AvatarImage for a photo and AvatarText as a fallback when no image is available.
- Use in contexts where quick visual identification of people helps users navigate, such as team rosters or conversation threads.
- Use with the `alt` prop to provide an accessible name for the avatar via `aria-label`.

## When Not to Use

- Do not use for decorative icons or illustrations -- use Icon instead.
- Do not use for organisation logos or non-person images -- use Image with appropriate alt text.
- Do not use when only one avatar is shown alongside extended profile information -- use a Person component instead.

## Headless

This component provides `role="img"`, `aria-label`, and image-to-initials fallback logic with zero visual styling. The consumer is responsible for all CSS including circular framing, sizing, background color for initials, font styling, border, and shadow effects.


## Styles

The consumer provides all CSS styling. The component renders with a `.avatar` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `avatar`
- Verify role="img"` -- on the outer container, conveying that the entire avatar is an image representation
- Verify aria-label` -- set from the `alt` prop, providing the accessible name for the avatar
- Verify aria-hidden="true"` -- on the inner initials `<span>`, preventing duplicate announcements since the outer element already has `aria-label
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Maintain consistent avatar sizes throughout the application. Use a contrasting background color behind initials text to ensure legibility.
- **Developers**: Always provide the `alt` prop for accessibility. When using both `src` and `initials`, the component automatically falls back to initials if the image fails to load.

## Composition

Avatar follows a parent/child composition pattern:

- **Avatar** -- outer `<span>` container with `role="img"` and `aria-label` for the accessible name.
- **AvatarImage** -- `<img>` element displayed when a valid image source is available.
- **AvatarText** -- `<span>` element displayed as a fallback with initials or short text.

```html
<Avatar src="/photo.jpg" alt="Jane Doe" initials="JD" />
```

## References

- WAI-ARIA Img Role: https://www.w3.org/TR/wai-aria-1.2/#img
