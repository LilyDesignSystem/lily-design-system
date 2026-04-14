# File Manager

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
- `children`: slot (required) -- the file browser content

## Usage

Project file browser with folder navigation:

```html
<FileManager label="Project files">
    <nav aria-label="Folder breadcrumb">
        <a href="/">Root</a> / <a href="/docs">docs</a>
    </nav>
    <ul>
        <li><button>📁 reports/</button></li>
        <li><button>📄 meeting-notes.pdf</button></li>
        <li><button>📄 budget.xlsx</button></li>
    </ul>
    <div>
        <button>Upload</button>
        <button>New folder</button>
    </div>
</FileManager>
```

## Keyboard Interactions

None built-in -- the consumer should implement keyboard navigation for file selection, folder traversal, and action triggers as appropriate.

## ARIA

- `role="region"` -- defines the file manager as a named landmark section
- `aria-label={label}` -- provides an accessible name for the region

## When to Use

- Use for browsing, navigating, and managing files in a directory structure.
- Use in CMS applications, cloud storage dashboards, or document editors.
- Use when users need to navigate folder hierarchies, view file listings, and perform file operations.

## When Not to Use

- Do not use for simple single-file upload -- use FileUpload instead.
- Do not use for file selection in a modal dialog -- use FileDialog instead.
- Do not use for a basic file input without browsing -- use FileInput instead.

## Headless

This headless component provides a `<div>` with `role="region"` and `aria-label`, defining a named landmark that screen reader users can navigate to directly. The consumer provides all visual styling, file listing content, folder navigation, action controls, and keyboard navigation.


## Styles

The consumer provides all CSS styling. The component renders with a `.file-manager` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `file-manager`
- Verify role="region"` -- defines the file manager as a named landmark section
- Verify aria-label={label}` -- provides an accessible name for the region
- Verify pass-through attributes are applied

## Advice

- **Designers**: Organize the interface with clear navigation (breadcrumbs or tree view), a file list area, and contextual action buttons. Use icons to differentiate file types and folders.
- **Developers**: Implement keyboard navigation for file selection and folder traversal. Use the region landmark to help screen reader users locate the file manager quickly within the page.

## References

- WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region
- WAI-ARIA Landmark Regions: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
