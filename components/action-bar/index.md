# Action Bar

An action bar is a contextual toolbar that appears when items are selected,
showing the current selection count alongside bulk action buttons.

Use it above a list, table, gallery, or canvas where users can multi-select
items and apply bulk operations such as delete, archive, move, or share. The
action bar communicates how many items are affected and offers a clear way
to dismiss the selection.

## Implementation Notes

- Uses a `<div>` with `role="toolbar"` so assistive tech announces it as a grouping of actions
- `label` prop is **required** and renders as `aria-label` on the toolbar
- `selectedCount` is exposed via `data-selected-count` for consumer styling and tests
- `selectedCountLabel` is consumer-supplied (pre-formatted, locale-aware)
- The clear-selection button renders only when both `clearSelectionLabel` and `onClearSelection` are provided
- Bulk action buttons are children — typically `action-bar-button` components

## Props

- `label`: string (**required**) -- aria-label for the toolbar
- `selectedCount`: number (**required**) -- count of currently selected items
- `selectedCountLabel`: string (**required**) -- pre-formatted count text (e.g., "3 selected")
- `clearSelectionLabel`: string (optional) -- accessible label for the clear-selection button
- `onClearSelection` / `onclearselection`: callback (optional) -- clear-selection click handler
- `children`: slot -- bulk action buttons
- `...restProps`: any additional HTML attributes

## Usage

```html
<ActionBar
  label="Bulk actions"
  selectedCount={3}
  selectedCountLabel="3 selected"
  clearSelectionLabel="Clear selection"
  onClearSelection={handleClear}
>
  <ActionBarButton label="Delete" onClick={handleDelete}>Delete</ActionBarButton>
  <ActionBarButton label="Archive" onClick={handleArchive}>Archive</ActionBarButton>
</ActionBar>
```

## Keyboard Interactions

- Tab: Move focus into and out of the toolbar
- Arrow keys: (Consumer-provided) roving tabindex among action buttons is recommended
- Enter / Space: Activate the focused action button (native button behavior)
- Escape: (Consumer-provided) dismiss or clear selection

## ARIA

- `role="toolbar"` on the container
- `aria-label` provides the accessible name (required)
- `data-selected-count` exposes selection count for styling and tests
- Clear button has its own `aria-label` via `clearSelectionLabel`

## When to Use

- Use when users can select multiple items and apply bulk operations
- Use to surface contextual actions only while a selection exists
- Use to communicate the count of selected items unambiguously

## When Not to Use

- Do not use as a primary navigation toolbar — use a TabBar or ToolBar
- Do not use when only a single item action is needed — use the row's own controls
- Do not hard-code the count text — always pass a localized `selectedCountLabel`

## Composition

The action bar pairs with `action-bar-button`:

```html
<ActionBar label="Bulk actions" selectedCount={2} selectedCountLabel="2 selected">
  <ActionBarButton label="Delete">Delete</ActionBarButton>
  <ActionBarButton label="Move">Move</ActionBarButton>
</ActionBar>
```

## Headless

Renders a `<div role="toolbar">` with `aria-label` and `data-selected-count`.
The visibility (show/hide based on selection), animation, positioning, and
visual treatment are entirely the consumer's responsibility.

## Styles

Consumer CSS targets the `action-bar` class. Use `data-selected-count` to
adapt visual treatment when no items are selected. Provide a clear focus
indicator on every interactive descendant.

## Testing

- Verify the component renders a `<div>` with `role="toolbar"` and class `action-bar`
- Verify `aria-label` equals the `label` prop
- Verify `data-selected-count` equals the `selectedCount` prop
- Verify the selectedCountLabel text is rendered
- Verify the clear button is rendered only when both `clearSelectionLabel` and `onClearSelection` are supplied
- Verify the clear-selection handler fires when the clear button is activated

## Advice

- **Designers**: Position the action bar predictably (top of the list or as a sticky bar). Maintain a high-contrast focus indicator.
- **Developers**: Format the count via `Intl.PluralRules` or your i18n library and pass the result as `selectedCountLabel`.

## Related components

- `action-bar-button` — one action button inside an action bar

## References

- WAI-ARIA Toolbar Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
- Adobe Spectrum Action Bar: https://spectrum.adobe.com/page/action-bar/
- WCAG 4.1.2 Name, Role, Value: https://www.w3.org/WAI/WCAG22/Understanding/name-role-value

---

Lily™ and Lily Design System™ are trademarks.
