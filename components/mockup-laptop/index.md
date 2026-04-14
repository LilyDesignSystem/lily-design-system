# MockupLaptop

A mockup laptop is a decorative container that visually resembles a laptop computer, used to frame content in documentation, demos, or marketing pages. It provides a recognizable laptop form factor around the contained content.

This headless component uses a `<div>` element with `role="img"` and `aria-label` to present the mockup as a decorative image to assistive technologies.

## Implementation Notes

- Uses `<div>` element with `role="img"` for decorative presentation
- `aria-label` describes the mockup content for screen readers
- Contains a slot for the laptop screen content area
- Consumer styles the laptop chrome (screen bezel, keyboard, trackpad)

## Props

- `label`: string (required) -- accessible label describing the mockup content
- `children`: slot (required) -- the content displayed inside the laptop screen
- `...restProps`: Any additional HTML attributes

## Usage

Basic laptop mockup with a screenshot:

```html
<MockupLaptop label="Dashboard application">
  <Image src="dashboard.png" alt="Dashboard screenshot" />
</MockupLaptop>
```

Laptop mockup for a product marketing section:

```html
<section class="hero">
  <h2>Built for productivity</h2>
  <MockupLaptop label="Project management application showing task board">
    <Image src="taskboard.png" alt="Task board with columns for To Do, In Progress, and Done" />
  </MockupLaptop>
</section>
```

Laptop mockup with live embedded content:

```html
<MockupLaptop label="Spreadsheet editor preview">
  <DataTable label="Q4 Revenue">
    <DataTableHead>
      <DataTableRow><DataTableCol>Month</DataTableCol><DataTableCol>Revenue</DataTableCol></DataTableRow>
    </DataTableHead>
    <DataTableBody>
      <DataTableRow><DataTableData>October</DataTableData><DataTableData>$42,000</DataTableData></DataTableRow>
      <DataTableRow><DataTableData>November</DataTableData><DataTableData>$48,500</DataTableData></DataTableRow>
    </DataTableBody>
  </DataTable>
</MockupLaptop>
```

## Keyboard Interactions

- None -- mockups are decorative, not interactive

## ARIA

- `role="img"` -- presents the mockup as a single image to assistive technologies
- `aria-label` -- describes the mockup content for screen readers

## When to Use

- Use to display desktop application designs or screenshots in a realistic laptop frame.
- Use in marketing or portfolio pages to present software products professionally.
- Use in case studies or presentations to show how an application looks on a laptop.
- Use in design documentation to demonstrate desktop-specific layouts and interactions.

## When Not to Use

- Do not use for responsive design testing -- use actual responsive design tooling instead.
- Do not use for web-specific content that needs an address bar -- use MockupBrowser instead.
- Do not use for mobile content -- use MockupPhone instead.

## Headless

This component provides a `<div>` with `role="img"` and `aria-label` for accessible decorative presentation, with zero visual styling. The consumer is responsible for all CSS including laptop frame appearance, screen bezel, keyboard area, and content area sizing.

## Styles

The consumer provides all CSS styling. The component renders with a `.mockup-laptop` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `mockup-laptop`
- Verify `role="img"` is present
- Verify `aria-label` is applied
- Verify child content is rendered
- Verify pass-through attributes are applied

## Advice

- **Designers**: Include recognizable laptop elements (screen bezel, keyboard hint) for clear identification. Maintain proper aspect ratio for the screen area.
- **Developers**: Always provide a descriptive `label` prop so screen readers can convey the mockup's purpose.
