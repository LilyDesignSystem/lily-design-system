# AvatarGroup

## Metadata

- Component: avatar-group
- PascalCase: AvatarGroup
- Description: a group of avatar components
- HTML tag: <div>
- CSS class: .avatar-group
- Interactive: no

## Key Behaviors

- Uses `<div>` element with `role="group"` to semantically group avatars
- `aria-label` describes the group
- Renders child avatar components in source order
- Consumer controls overlap, spacing, and truncation via CSS

## ARIA

- `role="group"` -- semantically groups the contained avatars
- `aria-label` -- describes the purpose of the group

## Keyboard

- None -- avatar groups are informational, not interactive

## Props

- `label`: string (required) -- accessible label for the avatar group
- `children`: slot -- avatar components
- `...restProps`: Any additional HTML attributes

## Key Behaviors

Pattern: AvatarGroup → Avatar → AvatarImage, AvatarText

```tsx
<AvatarGroup>
  <Avatar>
    <AvatarImage>…</AvatarImage>
    <AvatarText>…</AvatarText>
  </Avatar>
  <Avatar>
    <AvatarImage>…</AvatarImage>
    <AvatarText>…</AvatarText>
  </Avatar>
</AvatarGroup>
```

## Acceptance Criteria

- [ ] Renders <div> element with class="avatar-group"
- [ ] Has role="group"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .avatar-group in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/avatar-group.html
