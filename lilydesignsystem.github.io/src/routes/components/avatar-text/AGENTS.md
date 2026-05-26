# AvatarText

## Metadata

- Component: avatar-text
- PascalCase: AvatarText
- Description: an avatar indicator inner text such as a user name
- HTML tag: <span>
- CSS class: .avatar-text
- Interactive: no

## ARIA

- Typically marked `aria-hidden="true"` when inside an Avatar, since the parent's `aria-label` already provides the accessible name
- When used standalone, ensure the text is accessible or the parent provides an accessible label

## Keyboard

- None -- this is a decorative/informational element, not interactive

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

## Props

| Prop           | Type            | Default    | Description                                            |
| -------------- | --------------- | ---------- | ------------------------------------------------------ |
| `children`     | `slot`       | (required) | Initials or short text to display                      |
| `...restProps` | HTML attributes |            | Additional attributes spread onto the `<span>` element |

## Acceptance Criteria

- [ ] Renders <span> element with class="avatar-text"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .avatar-text in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/avatar-text.html
- WAI-ARIA Img Role: https://www.w3.org/TR/wai-aria-1.2/#img
