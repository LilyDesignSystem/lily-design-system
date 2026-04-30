# PopconfirmDialog

## Metadata

- Component: popconfirm-dialog
- PascalCase: PopconfirmDialog
- Description: a popover dialog with confirm and cancel buttons
- HTML tag: <div>
- CSS class: .popconfirm-dialog
- Interactive: yes

## Key Behaviors

- Renders <div class="popconfirm-dialog" role="alertdialog" aria-modal="false">
- title prop is REQUIRED and rendered inside <h2 class="popconfirm-dialog-title">
- Optional description renders inside <p class="popconfirm-dialog-description">
- aria-labelledby references the title id; aria-describedby references the description id (when present)
- confirmLabel and cancelLabel props are REQUIRED
- Buttons: <button class="popconfirm-dialog-cancel" type="button"> and <button class="popconfirm-dialog-confirm" type="button">
- Container hidden attribute reflects the open prop

## ARIA

- role="alertdialog"
- aria-modal="false"
- aria-labelledby references title id
- aria-describedby references description id (only when description present)

## Keyboard

- Tab / Shift+Tab: Move focus between buttons
- Enter / Space: Activate focused button
- Escape: Consumer closes and triggers cancel

## Props

- `open`: boolean (default: false)
- `title`: string (REQUIRED)
- `description`: string (optional)
- `confirmLabel`: string (REQUIRED)
- `cancelLabel`: string (REQUIRED)
- `onconfirm` / `onConfirm`: callback (optional)
- `oncancel` / `onCancel`: callback (optional)
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div class="popconfirm-dialog"> with role="alertdialog" and aria-modal="false"
- [ ] title renders as <h2> with class="popconfirm-dialog-title" and a stable id
- [ ] description renders as <p> with class="popconfirm-dialog-description" and id (when provided)
- [ ] aria-labelledby references the title id
- [ ] aria-describedby references the description id only when description is provided
- [ ] Cancel and confirm buttons have correct classes, type="button", and labels
- [ ] Container is hidden when open is false
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .popconfirm-dialog in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/popconfirm-dialog.html
- WAI-ARIA Alert Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/
- Ant Design Popconfirm: https://ant.design/components/popconfirm
