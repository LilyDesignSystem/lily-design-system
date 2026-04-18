# FileManager

A file manager is a component that provides an interface for browsing, organizing, and managing files and directories. Commonly used in content management systems, cloud storage applications, document editors, and admin dashboards, the file manager enables users to navigate folder hierarchies, view file listings, and perform operations such as uploading, downloading, renaming, and deleting files.

This headless component renders a `<div>` with `role="region"` and an accessible label, defining a semantic boundary for the file management area. The consumer provides the file listing, navigation controls, and interaction behavior as children.

## Implementation Notes

- Renders a `<div>` with `role="region"` to define a named landmark for the file management area
- Consumer provides all file listing, folder navigation, and action controls as children
- The region role with a label allows screen reader users to navigate directly to this section
- Accepts `...restProps` for forwarding additional attributes to the container
- No internal state -- purely a structural wrapper

## Props

- `label`: string (required) -- accessible name describing the file manager, applied via `aria-label`
- `children`: Snippet (required) -- the file browser content

## Usage

```svelte
<FileManager label="Project files">
    <ul>
        <li>document.pdf</li>
        <li>image.png</li>
        <li>data.csv</li>
    </ul>
</FileManager>
```

## Keyboard Interactions

None built-in -- the consumer should implement keyboard navigation for file selection, folder traversal, and action triggers as appropriate.

## ARIA

- `role="region"` -- defines the file manager as a named landmark section
- `aria-label={label}` -- provides an accessible name for the region

## References

- WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region
- WAI-ARIA Landmark Regions: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
