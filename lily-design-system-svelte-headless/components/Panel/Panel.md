# Panel

A panel is a UI component that serves as a labeled container for grouping related content, controls, or settings within an interface. The Panel component renders a semantic `<section>` element with an accessible label, creating a named region landmark that assistive technology can identify and navigate to.

Panels are commonly used in dashboards, settings pages, sidebars, and multi-section layouts to organize information into logical groups. The required label ensures each panel is identifiable, which is especially important when multiple panels appear on the same page.

## Implementation Notes

- Renders a `<section>` HTML element, which creates a landmark region when labelled
- The `label` prop is required and applied via `aria-label` to name the region
- Content is provided via the `children` snippet
- Rest props are spread onto the `<section>` element
- A `<section>` with `aria-label` becomes a navigable region in screen reader landmark lists

## Props

- `label`: string (required) -- accessible name for the panel region via `aria-label`
- `children`: Snippet (required) -- the panel content
- `...restProps`: unknown -- additional attributes spread onto the `<section>` element

## Usage

```svelte
<!-- Basic panel with labeled region -->
<Panel label="Settings">
  <p>Adjust your preferences below.</p>
</Panel>

<!-- Multiple panels on a page -->
<Panel label="Account information">
  <p>Name, email, and profile details.</p>
</Panel>
<Panel label="Notification preferences">
  <p>Choose how you want to be notified.</p>
</Panel>
```

## Keyboard Interactions

None -- this component is a passive container. Screen reader users can navigate to named regions using landmark navigation shortcuts.

## ARIA

- `<section aria-label="...">` -- creates a named region landmark, allowing assistive technology to list and navigate to this section
- The `aria-label` value should be concise and descriptive of the panel's content

## References

- WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region
- HTML section element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section
- WAI Landmarks: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
