# Sidebar

Sidebar is a headless complementary region that uses the semantic `<aside>` element. It provides a labeled landmark for content that is tangentially related to the main content, such as navigation menus, filters, related links, or supplementary information.

Use Sidebar when you need a distinct region alongside main content that assistive technologies can identify and navigate to as a landmark. The `<aside>` element inherently carries the ARIA `complementary` role, so screen readers will announce it as a complementary landmark. The component applies no visual styling, leaving layout, width, positioning, and appearance entirely to the consumer.

## Implementation Notes

- Renders an `<aside>` element, which has an implicit `complementary` landmark role
- The `aria-label` attribute provides an accessible name to distinguish this sidebar from other landmarks
- Spreads `restProps` onto the aside for consumer customization
- No internal state management; this is a purely structural component

## Props

- `label`: string (required) -- accessible label for the sidebar region, applied via `aria-label`
- `children`: slot (required) -- content to render inside the sidebar
- `...restProps`: unknown -- additional attributes spread onto the `<aside>` element

## Usage

Sidebar with navigation links:

```html
<Sidebar label="Navigation">
  <nav>
    <a href="/dashboard">Dashboard</a>
    <a href="/projects">Projects</a>
    <a href="/team">Team</a>
    <a href="/settings">Settings</a>
  </nav>
</Sidebar>
```

Sidebar with filters for a search results page:

```html
<Sidebar label="Search filters">
  <form>
    <fieldset>
      <legend>Category</legend>
      <label><input type="checkbox" value="docs" /> Documentation</label>
      <label><input type="checkbox" value="api" /> API Reference</label>
      <label><input type="checkbox" value="guides" /> Guides</label>
    </fieldset>
    <Separator />
    <fieldset>
      <legend>Date range</legend>
      <label for="from">From</label>
      <DateInput label="From date" id="from" value={fromDate} />
      <label for="to">To</label>
      <DateInput label="To date" id="to" value={toDate} />
    </fieldset>
  </form>
</Sidebar>
```

Sidebar alongside main content:

```html
<div class="page-layout">
  <Sidebar label="Documentation navigation">
    <TreeNav label="Docs sections">
      <TreeList>
        <TreeListItem><TreeLink href="/docs/getting-started">Getting Started</TreeLink></TreeListItem>
        <TreeListItem><TreeLink href="/docs/components">Components</TreeLink></TreeListItem>
      </TreeList>
    </TreeNav>
  </Sidebar>
  <main>
    <h1>Getting Started</h1>
    <p>...</p>
  </main>
</div>
```

## Keyboard Interactions

None -- this component is a passive container. Keyboard navigation depends on the interactive content placed inside it by the consumer.

## ARIA

- Implicit `complementary` role via the `<aside>` element -- identifies the container as a complementary landmark
- `aria-label={label}` -- provides an accessible name so screen readers can distinguish this sidebar from other landmarks on the page

## When to Use

- Use for a side panel containing navigation menus, filters, or supplementary content within a page layout.
- Use when content is tangentially related to the main content and benefits from being in a distinct, navigable landmark region.
- Use when assistive technology users should be able to jump directly to this supplementary region.
- Use for persistent side navigation that remains visible alongside the main content.

## When Not to Use

- Do not use for slide-in overlays -- use Drawer or Sheet instead.
- Do not use within GrailLayout -- use GrailLayoutLeftAside or GrailLayoutRightAside instead.
- Do not use for primary page content -- use a `<main>` element instead.

## Headless

This headless component renders a semantic `<aside>` element with an `aria-label` for landmark identification. It provides the complementary landmark role automatically. The consumer provides all visual styling including width, positioning, layout, and responsive behavior.


## Styles

The consumer provides all CSS styling. The component renders with a `.sidebar` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<aside>` element with class `sidebar`
- Verify aria-label={label}` -- provides an accessible name so screen readers can distinguish this sidebar from other landmarks on the page
- Verify pass-through attributes are applied

## Advice

- **Designers**: Keep sidebar width proportional to the main content area, typically 20-30% of the viewport. Provide clear visual separation from the main content using borders, background color, or spacing.
- **Developers**: Use a descriptive `label` prop to distinguish this sidebar from other landmarks on the page. Avoid placing more than two sidebar landmarks on a single page to prevent landmark clutter.

## References

- WAI-ARIA Complementary Role: https://www.w3.org/TR/wai-aria-1.2/#complementary
- WAI-ARIA Landmark Regions: https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/
- HTML `<aside>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside
