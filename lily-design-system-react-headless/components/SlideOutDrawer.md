# SlideOutDrawer

A slide-out drawer is a UI/UX component that slides in from the side of the
screen -- usually from the left or right -- to reveal additional content or
navigation options without leaving the current page. Often triggered by a button
or swipe gesture, it is commonly used for menus, filters, settings, or secondary
content in mobile and web applications. This component allows for efficient use
of screen space by keeping less frequently used options hidden until needed,
enhancing focus and minimizing clutter in the main interface while maintaining
easy access to extended functionality.

This component renders as a native `<dialog>` with `aria-label` and
`aria-modal="true"`, opened with `showModal()`, when open, and is completely removed from the DOM when
closed. The `open` prop supports controlled component usage, and the Escape key
closes the drawer.

## Implementation Notes

- Renders as `<dialog aria-label={label} aria-modal="true">` when open
- Opened with `showModal()`: the browser puts it in the top layer, makes the page behind it inert, traps Tab inside it and moves focus in; on close, focus returns to the element that opened it. Escape (keydown or the native `cancel` event) closes it. Where `showModal` is missing (jsdom) it falls back to the `open` attribute
- Conditionally rendered -- not in the DOM when closed
- The `open` prop supports controlled component usage
- Escape key closes the drawer via a keydown handler
- `tabindex="-1"` allows the dialog div to receive focus programmatically

## Props

- `label`: string (required) -- accessible label for the dialog
- `open`: boolean (default: false) -- whether the drawer is visible, controlled
- `children`: ReactNode (required) -- drawer content
- `...restProps`: Any additional HTML attributes spread onto the `<dialog>`

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

- `role="dialog"` provided natively by the `<dialog>` element
- `aria-label` from the label prop provides the accessible name
- `aria-modal="true"` indicates modal behavior (content behind the drawer is inert)
- `tabindex="-1"` for programmatic focus management

## References

- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog
