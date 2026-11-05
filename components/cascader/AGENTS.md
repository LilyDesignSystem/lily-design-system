# Cascader

## Metadata

- Component: cascader
- PascalCase: Cascader
- Description: a multi-level dropdown for selecting a value from a hierarchy
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <div>
- CSS class: .cascader
- Interactive: yes

## Key Behaviors

- Renders <div role="combobox" aria-haspopup="tree" aria-expanded aria-label> as container
- Trigger is a native <button class="cascader-trigger" type="button"> showing value or placeholder
- Panel is a <div class="cascader-panel"> `popover="manual"`, shown while `expanded` (the hidden attribute where the Popover API is missing)
- label prop is REQUIRED and sets aria-label on the combobox container
- disabled disables the trigger button
- Children populate the panel content

## ARIA

- role="combobox" on the container
- aria-haspopup="tree"
- aria-expanded reflects the expanded prop
- aria-label is the accessible name (required)

## Keyboard

- Tab: Focus the trigger
- ArrowDown, or a click on the trigger: Opens the panel on the selected item, or the first
- In the tree: ArrowDown and ArrowUp move between visible items and wrap; ArrowRight opens a branch, then moves to its first child; ArrowLeft closes a branch, then moves to its parent, swapped in right-to-left; Home and End jump; a typed letter jumps
- Enter, Space: Toggle a branch, or choose a leaf
- Escape: Closes the panel and returns to the trigger

Project a `role="tree"` into the panel. A single choice closes it; a multiple one (`multiple`) stays open and toggles `aria-selected`. With `exclusive` behaviour, opening a branch closes its siblings. From `shared/widget-keys.ts`, held to the `tree-popup` contract. An item's value is its `data-value`, else its own text; the choice reports its value, path and every selected value.

## Props

- `label`: string (REQUIRED) -- aria-label
- `expanded`: boolean (default: false)
- `disabled`: boolean (default: false)
- `placeholder`: string (optional)
- `value`: string (optional)
- `onclick` / `onClick`: callback (optional)
- `children`: slot — panel content
- `...restProps`: any additional HTML attributes

## Native platform

- Decision: native
- Uses: native <button> trigger; panel div popover="manual" shown from the expanded state
- Could use: CSS anchor positioning to the trigger (theme)
- Notes: P16-T4 (2026-10-31): in Svelte, React, Vue, HTML, Alpine and Web Components, and Angular, always rendered with popover="manual" (Blazor has no popover here yet). Nunjucks keeps the hidden attribute: its macros render the state on the server and have no script to call showPopover(), and a manual popover cannot be open in server-rendered HTML. Always rendered with popover="manual" and opened by the state through Popover/popover.ts, with the hidden attribute where the Popover API is missing (jsdom, older engines). Top layer removes z-index and overflow clipping; Escape and light dismiss stay the consumer's. The hierarchy has no native equivalent: <optgroup> is one level and not selectable.
- Source: `spec/competitive-position/native-primitives.tsv` (P16-T4)

## Acceptance Criteria

- [ ] Renders <div> with class="cascader"
- [ ] role="combobox" and aria-haspopup="tree" are present
- [ ] aria-expanded reflects the expanded prop
- [ ] aria-label equals the label prop
- [ ] Trigger button has type="button" and respects disabled
- [ ] Panel is hidden when expanded is false
- [ ] Children render inside the panel
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .cascader in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/cascader.html
- WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- Ant Design Cascader: https://ant.design/components/cascader
