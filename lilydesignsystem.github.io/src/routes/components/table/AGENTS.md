# Table

## Metadata

- Component: table
- PascalCase: Table
- Description: a table with rows and columns <table>
- HTML tag: <table>
- CSS class: .table
- Interactive: no

## Composition

- Pattern: Table/Head/Body/Foot/Col/Row/Data
- Children: table-head, table-body, table-foot, table-th, table-row, table-td

## Key Behaviors

- Renders as a semantic `<table>` element with `aria-label` for accessible naming
- All content (thead, tbody, tfoot, caption, colgroup, etc.) is provided through the `children` slot
- Uses props for prop destructuring with rest props spread
- Consumers are responsible for proper `<th scope="col">` and `<th scope="row">` attributes
- Consumers may add `<caption>` for a visible table title
- No built-in sorting, filtering, or pagination; consumers implement these as needed

## ARIA

- `aria-label` -- provides the accessible name for the table so screen readers can announce its purpose
- Semantic `<table>` element -- conveys tabular data structure to assistive technologies
- Consumers should use `<th scope="col">` for column headers and `<th scope="row">` for row headers

## Keyboard

- None directly -- standard table navigation is handled by screen readers and browser built-in behavior

## Props

- `label`: string (required) -- accessible label for the table via `aria-label`
- `children`: slot (required) -- table content including thead, tbody, tfoot, etc.
- `...restProps`: any -- additional HTML attributes spread onto the `<table>` element

## Acceptance Criteria

- [ ] Renders <table> element with class="table"
- [ ] Has aria-label attribute
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .table in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/table.html
- WAI-ARIA Table Role: https://www.w3.org/WAI/ARIA/apg/patterns/table/
- HTML Table Element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table
