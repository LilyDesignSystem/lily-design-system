# ImageCropper

## Metadata

- Component: image-cropper
- PascalCase: ImageCropper
- Description: a container for cropping and resizing an image to a selected region
- HTML tag: <div>
- CSS class: .image-cropper
- Interactive: no

## Key Behaviors

- Renders a `<div>` with `role="application"` to indicate complex widget behavior requiring pointer interaction (drag to move the crop region, drag handles to resize)
- Requires an `aria-label` describing the cropping purpose for accessibility
- Consumers provide the actual image and crop overlay UI (image, canvas, SVG handles, or a third-party cropping library) as children
- Spreads `restProps` onto the container for consumer customization

## ARIA

- `role="application"` -- indicates a complex widget with custom pointer interactions, informing assistive technologies to pass keyboard events through to the application
- `aria-label` -- provides an accessible description of the image cropper purpose

## Keyboard

- No keyboard interactions are baked in — this is a passive container. Consumers wire pointer and keyboard handling for the crop region and resize handles inside the provided children.

## Props

- `label`: string (required) -- accessible description of the image cropper via `aria-label`
- `children`: slot (required) -- the image and crop overlay surface (image, canvas, SVG, or cropping-library output)

## Acceptance Criteria

- [ ] Renders <div> element with class="image-cropper"
- [ ] Has aria-label attribute
- [ ] Has role="application"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .image-cropper in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/image-cropper.html
- WAI-ARIA application Role: https://www.w3.org/TR/wai-aria-1.2/#application
- Origin UI Angular Cropper: https://www.originui-ng.com/
