# Avatar

An avatar circle is a container that displays a user's profile image or fallback initials within a circular frame, commonly used to represent a user identity in apps, websites, and social platforms. This visual element provides a quick, recognizable way for users to identify themselves or others, often appearing in headers, comments, chat interfaces, and account menus.

This is a compound component: use with AvatarImage for photo avatars and AvatarText for initials/text fallbacks.

## Implementation Notes

- Outer `<span role="img" aria-label>` provides accessible image semantics
- Consumer provides AvatarImage and/or AvatarText as children
- Consumers apply circular styling via CSS (e.g., `border-radius: 50%`)
- No hardcoded strings; all text comes through props for internationalization

## Props

- `alt`: string (required) -- accessible description of the person, used as `aria-label`
- `children`: Snippet (required) -- AvatarImage and/or AvatarText elements
- `...restProps`: any -- additional HTML attributes spread onto the outer `<span>`

## Usage

```svelte
<Avatar alt="Jane Doe">
  <AvatarImage src="/photo.jpg" alt="Jane Doe" />
</Avatar>
```

```svelte
<Avatar alt="Jane Doe">
  <AvatarText>JD</AvatarText>
</Avatar>
```

```svelte
<Avatar alt="Jane Doe">
  <AvatarImage src="/photo.jpg" alt="Jane Doe" />
  <AvatarText>JD</AvatarText>
</Avatar>
```

## Keyboard Interactions

- None -- display-only component, not interactive

## ARIA

- `role="img"` on the container for assistive technologies
- `aria-label` provides the accessible name for the avatar

## References

- WAI-ARIA Img Role: https://www.w3.org/TR/wai-aria-1.2/#img
