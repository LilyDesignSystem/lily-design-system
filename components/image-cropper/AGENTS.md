# ImageCropper

## Metadata

- Component: image-cropper
- PascalCase: ImageCropper
- Description: a container for cropping and resizing an image to a selected region
- Status: experimental — recent catalog addition with the least accumulated depth; contract may still move
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

- ArrowLeft, ArrowRight, ArrowUp, ArrowDown: Move the crop rectangle. They are physical, since they move a rectangle over an image, not text, so right-to-left does not swap them
- Alt+arrows: Resize it
- Shift: Ten steps at a time
- Home, End: Jump along the row
- A key on a control inside it stays that control's

The rectangle is `{ x, y, width, height }` in percent, and stays inside the image. Each change writes `data-crop-x`, `-y`, `-width`, `-height` and `--crop-x`, `-y`, `-width`, `-height`, and reports the rectangle. Dragging, drawing the overlay, and announcing the position in the consumer's words are the consumer's. From `shared/widget-keys.ts`, held to the `cropper` contract.

## Props

- `label`: string (required) -- accessible description of the image cropper via `aria-label`
- `crop`: `{ x, y, width, height }`, optional -- where the rectangle starts, in percent; default the whole image
- `onCropChange`: function, optional -- called with each new rectangle
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
