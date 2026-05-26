# FileManager

## Metadata

- Component: file-manager
- PascalCase: FileManager
- Description: a file browser for navigating and managing files
- HTML tag: <div>
- CSS class: .file-manager
- Interactive: no

## Key Behaviors

- Renders a `<div>` with `role="region"` to define a named landmark for the file management area
- Consumer provides all file listing, folder navigation, and action controls as children
- The region role with a label allows screen reader users to navigate directly to this section
- Accepts `...restProps` for forwarding additional attributes to the container
- No internal state -- purely a structural wrapper

## ARIA

- `role="region"` -- defines the file manager as a named landmark section
- `aria-label={label}` -- provides an accessible name for the region

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name describing the file manager, applied via `aria-label`
- `children`: slot (required) -- the file browser content

## Acceptance Criteria

- [ ] Renders <div> element with class="file-manager"
- [ ] Has aria-label attribute
- [ ] Has role="region"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .file-manager in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/file-manager.html
- WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region
- WAI-ARIA Landmark Regions: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
