# AlertDialog

## Metadata

- Component: alert-dialog
- PascalCase: AlertDialog
- Description: a modal dialog for urgent messages requiring user acknowledgment
- HTML tag: <dialog>
- CSS class: .alert-dialog
- Interactive: yes

## Key Behaviors

- Uses native HTML `<dialog>` element with the `open` attribute for visibility
- `role="alertdialog"` distinguishes from regular dialogs -- indicates critical content requiring acknowledgment
- two-way binding on the `open` prop for dialog visibility
- Conditionally rendered with conditional rendering to remove from DOM when closed
- `aria-modal="true"` signals modal behavior to assistive technologies
- Title rendered in a `<p><strong>` element, referenced by `aria-labelledby`
- Description rendered in a `<p>` element, referenced by `aria-describedby` when present
- Consumers are responsible for focus trapping and Escape key handling

## ARIA

- `role="alertdialog"`
- `aria-modal="true"`
- `aria-labelledby` references the title element
- `aria-describedby` references the description element (when present)

## Keyboard

- Escape: Closes the dialog (consumer must implement via onkeydown)
- Tab: Focus should be trapped within the dialog (consumer responsibility)

## Props

- `open`: boolean (default: false, bindable) -- whether the dialog is visible
- `title`: string (required) -- dialog heading, referenced by aria-labelledby
- `description`: string (optional) -- dialog message, referenced by aria-describedby
- `children`: slot -- action buttons and additional content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <dialog> element with class="alert-dialog"
- [ ] Has aria-label attribute
- [ ] Has role="alertdialog"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .alert-dialog in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/alert-dialog.html
- WAI-ARIA alertdialog role: https://www.w3.org/TR/wai-aria-1.2/#alertdialog
- WAI-ARIA Alert and Message Dialogs Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/
