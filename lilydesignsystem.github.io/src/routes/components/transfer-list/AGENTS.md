# TransferList

## Metadata

- Component: transfer-list
- PascalCase: TransferList
- Description: a dual list box for moving items between two lists
- HTML tag: <div>
- CSS class: .transfer-list
- Interactive: yes

## Key Behaviors

- Renders <div class="transfer-list" role="group"> as container
- label prop is REQUIRED and applied as aria-label on the group
- Source content rendered inside <section class="transfer-list-source" aria-label={sourceLabel}>
- Target content rendered inside <section class="transfer-list-target" aria-label={targetLabel}>
- Optional actions content rendered inside <div class="transfer-list-actions">
- sourceLabel and targetLabel are REQUIRED

## ARIA

- role="group" on container with aria-label from label prop
- Each <section> has aria-label from sourceLabel / targetLabel
- Consumer-supplied listboxes carry their own ARIA roles

## Keyboard

- None at the container level — keyboard behavior lives on consumer-supplied listboxes and action buttons

## Props

- `label`: string (REQUIRED)
- `sourceLabel`: string (REQUIRED)
- `targetLabel`: string (REQUIRED)
- `source`: slot (REQUIRED)
- `target`: slot (REQUIRED)
- `actions`: slot (optional)
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> with class="transfer-list" and role="group"
- [ ] aria-label equals the label prop
- [ ] Source slot renders inside <section class="transfer-list-source"> with aria-label
- [ ] Target slot renders inside <section class="transfer-list-target"> with aria-label
- [ ] Actions slot renders inside <div class="transfer-list-actions"> only when provided
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .transfer-list in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/transfer-list.html
- WAI-ARIA Listbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
- Ant Design Transfer: https://ant.design/components/transfer
