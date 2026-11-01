# Popover

## Metadata

- Component: popover
- PascalCase: Popover
- Description: a floating content box anchored to a trigger element
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <div>
- CSS class: .popover
- Interactive: yes

## Key Behaviors

- Always renders a `<div popover="auto" role="dialog">` (not conditionally), so a trigger can name its `id`
- The native Popover API does the work: top layer while open, Escape and a click outside close it (light dismiss), no script
- A consumer trigger opens it with `command="toggle-popover" commandfor="{id}"` (Chrome 135, Firefox 144, Safari 26.2), plus `popovertarget="{id}"` for engines before command/commandfor (Chrome 114, Firefox 125, Safari 17); this works with no JavaScript, so the HTML and Nunjucks versions open without script
- `open` is bindable: setting it calls `showPopover()` / `hidePopover()`; the element's `toggle` event writes the browser's own changes (Escape, light dismiss, a trigger) back to `open` and its callback
- Where `showPopover` is missing (jsdom, older engines) it falls back to the `hidden` attribute and drops `popover`; Escape and outside-click are then the consumer's (Alpine handles both)
- The `label` prop provides the dialog's accessible name via `aria-label`
- Rest props are spread onto the `<div>` element (pass `id` there; Angular uses `elementId`, Blazor `Id`)
- Content is provided via the `children` slot
- Non-modal: no focus trap and no inert background (use `dialog` for a modal)

## ARIA

- `role="dialog"` -- identifies the popover as a dialog overlay for assistive technology
- `aria-label="..."` -- provides the accessible name for the dialog
- The trigger (consumer's) should carry `aria-haspopup="dialog"` and `aria-controls`; the browser exposes a `popovertarget` trigger's expanded state

## Keyboard

- Enter / Space on the trigger: the browser toggles the popover (command / popovertarget)
- Escape: the browser closes it (Popover API); `open` becomes false
- Tab: not trapped -- a popover is non-modal

## Props

- `label`: string (required) -- accessible name for the popover dialog via `aria-label`
- `open`: boolean (default: false, bindable) -- whether the popover is shown; follows the browser's toggles
- `id`: string (rest prop) -- lets a trigger name it with `commandfor` / `popovertarget`
- `children`: slot (required) -- the popover content
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Native platform

- Decision: native
- Uses: Popover API popover="auto" on an always-rendered div role="dialog"; bindable open synced from the toggle event; consumer trigger uses command="toggle-popover" commandfor (or popovertarget)
- Could use: CSS anchor positioning
- Notes: Top layer, light dismiss and Escape with no script, also in the no-JS Nunjucks and HTML catalogs. Where showPopover is missing (jsdom, engines before Chrome 114 / Firefox 125 / Safari 17) it falls back to the hidden attribute, as tests exercise; the native path is tested with showPopover stubbed.
- Source: `spec/competitive-position/native-primitives.tsv` (P16-T4)

## Acceptance Criteria

- [ ] Renders <div> element with class="popover"
- [ ] Has aria-label attribute
- [ ] Has role="dialog"
- [ ] Has popover="auto" and stays in the DOM when closed
- [ ] The toggle event (light dismiss, Escape, a trigger) updates `open`
- [ ] Falls back to `hidden` where the Popover API is missing
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .popover in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/popover.html
- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog/
- WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog
- HTML popover attribute: https://html.spec.whatwg.org/multipage/popover.html
- HTML command and commandfor: https://html.spec.whatwg.org/multipage/form-elements.html#attr-button-command
