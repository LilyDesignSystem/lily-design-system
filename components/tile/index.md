# Tile

A tile is a grouping container that presents related content in a structured format, often as a single clickable area. Tiles are used in dashboards, grids, and selection interfaces where users choose from a set of options or navigate to related content.

This headless component uses a `<div>` element with appropriate ARIA attributes for accessible grouping and optional interactive behavior.

## Implementation Notes

- Uses `<div>` element for flexible content grouping
- `aria-label` describes the tile content for screen readers
- May be interactive (clickable) or static (informational)
- When interactive, manages focus and click behavior
- Contains slots for icon, title, description, and metadata

## Props

- `label`: string (optional) -- accessible label for the tile
- `interactive`: boolean (default: false) -- whether the tile is clickable
- `onclick`: callback (optional) -- click handler for interactive tiles
- `children`: slot (required) -- tile content
- `...restProps`: Any additional HTML attributes

## Usage

Static informational tile:

```html
<Tile label="Analytics dashboard">
  <Icon name="chart" />
  <h3>Analytics</h3>
  <p>View your site analytics and metrics.</p>
</Tile>
```

Interactive tile for selecting a pricing plan:

```html
<Tile interactive onclick={handleSelect} label="Select Pro plan">
  <h3>Pro Plan</h3>
  <p>$29/month</p>
  <ul>
    <li>Unlimited projects</li>
    <li>Priority support</li>
    <li>Custom domains</li>
  </ul>
</Tile>
```

Dashboard grid with multiple tiles:

```html
<div class="dashboard-grid">
  <Tile interactive onclick={() => navigateTo('/patients')} label="View patients">
    <Icon name="people" />
    <h3>Patients</h3>
    <p>1,247 registered</p>
  </Tile>
  <Tile interactive onclick={() => navigateTo('/appointments')} label="View appointments">
    <Icon name="calendar" />
    <h3>Appointments</h3>
    <p>23 today</p>
  </Tile>
  <Tile interactive onclick={() => navigateTo('/reports')} label="View reports">
    <Icon name="document" />
    <h3>Reports</h3>
    <p>5 pending review</p>
  </Tile>
</div>
```

## Keyboard Interactions

- Tab: Focus the tile (when interactive)
- Enter: Activate the tile (when interactive)
- Space: Activate the tile (when interactive)

## ARIA

- `aria-label` -- describes the tile for screen readers
- `tabindex="0"` when interactive for keyboard focus
- `role="button"` when interactive

## When to Use

- Use for dashboard widgets, option grids, or navigation cards.
- Use when content needs to be presented as a cohesive, selectable unit.
- Use as a clickable container presenting related content in a structured format.
- Use in selection interfaces where users choose from a set of options.
- Use for feature or plan selection grids where each option is a distinct unit.

## When Not to Use

- Do not use for non-clickable content grouping -- use Card or Panel instead.
- Do not use for navigation menus -- use NavigationMenu instead.
- Do not use for simple text links -- use ActionLink instead.

## Headless

This component provides a `<div>` element with optional interactive behavior and ARIA attributes, with zero visual styling. The consumer is responsible for all CSS including background, border, padding, hover effects, focus indicator, grid layout, and responsive sizing.

## Styles

The consumer provides all CSS styling. The component renders with a `.tile` class for targeting. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `tile`
- Verify `aria-label` is applied when provided
- Verify interactive tiles have `tabindex="0"` and `role="button"`
- Verify keyboard interactions work for interactive tiles
- Verify pass-through attributes are applied

## Advice

- **Designers**: Use consistent sizing within tile grids. Provide clear hover and focus states for interactive tiles. Include visual hierarchy with icon, title, and description.
- **Developers**: Set `interactive` to true only when the entire tile is clickable. For tiles with internal links, keep the tile static and let the link handle navigation.
