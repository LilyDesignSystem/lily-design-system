# ContextualHelp

## Metadata

- Component: contextual-help
- PascalCase: ContextualHelp
- Description: a help button that opens a popover with explanatory content
- HTML tag: <div> wrapper with <button> trigger and <div role="dialog"> panel
- CSS class: .contextual-help
- Interactive: yes

## Key Behaviors

- Renders a <div class="contextual-help"> wrapper
- Renders a <button class="contextual-help-trigger" type="button"> with aria-label
- Trigger has aria-haspopup="dialog", aria-expanded reflecting `expanded`, and aria-controls referencing the panel id
- Renders a <div class="contextual-help-panel" role="dialog" id={panelId}> with the panel content
- Panel uses the hidden attribute when `expanded` is false
- Panel id is generated stably (useId / crypto.randomUUID / Math.random)
- Calls `onClick` when the trigger is activated

## ARIA

- Trigger: aria-label, aria-haspopup="dialog", aria-expanded, aria-controls
- Panel: role="dialog", matching id, hidden attribute when closed

## Keyboard

- Tab / Shift+Tab: Move focus into and out of the trigger and panel
- Enter / Space: Toggle the popover when the trigger is focused
- Escape: (Consumer-provided) close the popover

## Props

- `label`: string (REQUIRED) -- aria-label for the trigger
- `expanded`: boolean (default false)
- `onClick` / `onclick`: callback (optional)
- `children`: slot -- popover content
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Wrapper is a <div> with class="contextual-help"
- [ ] Trigger is a <button> with aria-label={label}
- [ ] Trigger has aria-haspopup="dialog"
- [ ] Trigger has aria-expanded reflecting `expanded`
- [ ] Trigger has aria-controls referencing the panel id
- [ ] Panel renders with role="dialog" and matching id
- [ ] Panel uses the hidden attribute when expanded is false
- [ ] Panel id is stable
- [ ] onClick fires when the trigger is activated
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .contextual-help in css-style-sheet-template.css
- Adobe Spectrum Contextual Help: https://spectrum.adobe.com/page/contextual-help/
- WAI-ARIA Dialog: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
