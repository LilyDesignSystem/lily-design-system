# ContextualHelp

## Metadata

- Component: contextual-help
- PascalCase: ContextualHelp
- Description: a help button that opens a popover with explanatory content
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <div> wrapper with <button> trigger and <div role="dialog"> panel
- CSS class: .contextual-help
- Interactive: yes

## Key Behaviors

- Renders a <div class="contextual-help"> wrapper
- Renders a <button class="contextual-help-trigger" type="button"> with aria-label={label} and the visible text {triggerLabel}
- Trigger has aria-haspopup="dialog", aria-expanded reflecting `expanded`, and aria-controls referencing the panel id
- Trigger opens the panel natively: command="toggle-popover" commandfor={panelId} (Chrome 135, Firefox 144, Safari 26.2) and popovertarget={panelId} (Chrome 114, Firefox 125, Safari 17), so it opens with no script (HTML, Nunjucks)
- Renders a <div class="contextual-help-panel" role="dialog" popover="auto" id={panelId}>: top layer while open, Escape and a click outside close it (light dismiss)
- `expanded` is bindable; the panel's `toggle` event writes the browser's changes back to it
- Where `showPopover` is missing (jsdom, older engines) the trigger's click toggles `expanded` and the panel uses the `hidden` attribute
- Panel id is generated stably (useId / $props.id() / a counter)
- Calls `onClick` when the trigger is activated; `preventDefault()` in it stops the toggle
- Nunjucks/HTML (no script): the trigger carries no static aria-expanded when closed (nothing would update it); the browser exposes a popovertarget trigger's expanded state. Nunjucks `expanded: true` renders the panel in place, without popover

## ARIA

- Trigger: aria-label, aria-haspopup="dialog", aria-expanded, aria-controls
- Panel: role="dialog", matching id, popover="auto"

## Keyboard

- Tab / Shift+Tab: Move focus into and out of the trigger and panel
- Enter / Space: Toggle the popover when the trigger is focused (browser, via command/commandfor)
- Escape: Close the popover (browser, Popover API)

## Props

- `label`: string (REQUIRED) -- aria-label for the trigger (its accessible name)
- `triggerLabel`: string (REQUIRED, no default) -- visible text of the trigger, such as "?" or "؟"; "" when CSS draws an icon (Nunjucks `triggerLabel`, or raw `triggerHtml`; Web Components `trigger-label`; Blazor `TriggerLabel`)
- `expanded`: boolean (default false, bindable)
- `onClick` / `onclick`: callback (optional)
- `children`: slot -- popover content
- `...restProps`: any additional HTML attributes

## Native platform

- Decision: native
- Uses: popover="auto" panel opened by command="toggle-popover" commandfor (and popovertarget) on its own trigger; toggle event syncs aria-expanded
- Could use: CSS anchor positioning
- Notes: Open, Escape and light dismiss with zero JS in all nine catalogs (verified with JavaScript disabled in Chromium and WebKit for HTML and Nunjucks). Scripted fallback where showPopover is missing: hidden attribute and a click toggle. The trigger text is now the required triggerLabel prop (no "?" default).
- Source: `spec/competitive-position/native-primitives.tsv` (P16-T4)

## Acceptance Criteria

- [ ] Wrapper is a <div> with class="contextual-help"
- [ ] Trigger is a <button> with aria-label={label}
- [ ] Trigger has aria-haspopup="dialog"
- [ ] Trigger has aria-expanded reflecting `expanded`
- [ ] Trigger has aria-controls referencing the panel id
- [ ] Panel renders with role="dialog" and matching id
- [ ] Trigger has command="toggle-popover", commandfor and popovertarget naming the panel
- [ ] Trigger text is triggerLabel (no default)
- [ ] Panel has popover="auto"; uses the hidden attribute only where the Popover API is missing
- [ ] The panel's toggle event updates expanded and aria-expanded
- [ ] Panel id is stable
- [ ] onClick fires when the trigger is activated
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .contextual-help in css-style-sheet-template.css
- Adobe Spectrum Contextual Help: https://spectrum.adobe.com/page/contextual-help/
- WAI-ARIA Dialog: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- HTML command and commandfor: https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-command
