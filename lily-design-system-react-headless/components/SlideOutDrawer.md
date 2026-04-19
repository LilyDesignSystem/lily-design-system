# SlideOutDrawer

A slide-out drawer is a UI/UX component that slides in from the side of the
screen -- usually from the left or right -- to reveal additional content or
navigation options without leaving the current page. Often triggered by a button
or swipe gesture, it is commonly used for menus, filters, settings, or secondary
content in mobile and web applications. This component allows for efficient use
of screen space by keeping less frequently used options hidden until needed,
enhancing focus and minimizing clutter in the main interface while maintaining
easy access to extended functionality.

This component renders as a `<div>` with `role="dialog"`, `aria-label`, and
`aria-modal="true"` when open, and is completely removed from the DOM when
closed. The `open` prop supports controlled component usage, and the Escape key
closes the drawer.

## Implementation Notes

- Renders as `<div role="dialog" aria-label={label} aria-modal="true">` when open
- Conditionally rendered -- not in the DOM when closed
- The `open` prop supports controlled component usage
- Escape key closes the drawer via a keydown handler
- `tabindex="-1"` allows the dialog div to receive focus programmatically

## Props

- `label`: string (required) -- accessible label for the dialog
- `open`: boolean (default: false) -- whether the drawer is visible, controlled
- `children`: ReactNode (required) -- drawer content
- `...restProps`: Any additional HTML attributes spread onto the `<div>`

## Usage

```tsx
import SlideOutDrawer from "./SlideOutDrawer";

const [isOpen, setIsOpen] = useState(false);

<button onClick={() => setIsOpen(true)}>Open menu</button>

<SlideOutDrawer label="Navigation menu" open={isOpen} onChange={setIsOpen}>
  <nav>
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/contact">Contact</a></li>
    </ul>
  </nav>
  <button onClick={() => setIsOpen(false)}>Close</button>
</SlideOutDrawer>
```

Settings panel:

```tsx
import SlideOutDrawer from "./SlideOutDrawer";

const [settingsOpen, setSettingsOpen] = useState(false);

<button onClick={() => setSettingsOpen(true)}>Settings</button>

<SlideOutDrawer label="Settings panel" open={settingsOpen} onChange={setSettingsOpen}>
  <h2>Settings</h2>
  <form>
    <label>
      <input type="checkbox" /> Enable notifications
    </label>
  </form>
</SlideOutDrawer>
```

## Keyboard Interactions

- Escape closes the drawer

## ARIA

- `role="dialog"` for modal dialog semantics
- `aria-label` from the label prop provides the accessible name
- `aria-modal="true"` indicates modal behavior (content behind the drawer is inert)
- `tabindex="-1"` for programmatic focus management

## References

- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog
