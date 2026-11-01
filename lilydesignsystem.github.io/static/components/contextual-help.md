# Contextual Help

A contextual help is a small help button — often a question-mark glyph —
that opens a popover with explanatory content for a nearby field, control,
or concept.

**Status:** beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows.

Use it next to labels and headings where users may need extra explanation
on demand without cluttering the primary UI. The help content is hidden by
default and revealed only when the user requests it.

## Implementation Notes

- Uses a `<div>` wrapper with class `contextual-help`
- The trigger is a `<button class="contextual-help-trigger" type="button">` with `aria-haspopup="dialog"`, named by `label` (`aria-label`) and showing `triggerLabel` as its visible text
- The panel is a `<div class="contextual-help-panel" role="dialog" popover="auto">`: the browser shows it in the top layer and closes it on Escape or a click outside (light dismiss)
- The trigger opens it natively with `command="toggle-popover" commandfor={panelId}` (Chrome 135, Firefox 144, Safari 26.2) and `popovertarget={panelId}` (Chrome 114, Firefox 125, Safari 17), so the HTML and Nunjucks versions open with no script
- `expanded` is two-way bound and reflected on the trigger via `aria-expanded`; the panel's `toggle` event keeps it in step
- Where `showPopover` is missing (jsdom, older engines) the trigger's click toggles `expanded` and the panel's `hidden` attribute
- The trigger references the panel via `aria-controls={panelId}`; the panel id is generated stably (`useId`, `$props.id()`, a counter)
- Nunjucks and HTML render no static `aria-expanded` on a closed trigger, since nothing would update it without script; the browser exposes a `popovertarget` trigger's expanded state itself

## Props

- `label`: string (**required**) -- aria-label for the help trigger button (its accessible name)
- `triggerLabel`: string (**required**, no default) -- the trigger's visible text, such as `?` or `؟`; pass `""` when CSS draws an icon. Web Components: `trigger-label`; Blazor: `TriggerLabel`; Nunjucks also takes raw `triggerHtml`
- `expanded`: boolean (default `false`, bindable) -- whether the popover is open
- `onClick` / `onclick`: callback (optional) -- trigger click handler; `preventDefault()` stops the toggle
- `children`: slot -- popover content
- `...restProps`: any additional HTML attributes

## Usage

```html
<ContextualHelp
  label="Help for username"
  triggerLabel="?"
  bind:expanded={open}
>
  <h3>Username</h3>
  <p>Use 3-20 characters. Letters, numbers, and underscores only.</p>
</ContextualHelp>
```

## Keyboard Interactions

- Tab / Shift+Tab: Move focus into and out of the trigger and panel
- Enter / Space: Activate the trigger to toggle the popover (the browser, through `command` / `commandfor`)
- Escape: Close the popover (the browser, through the Popover API)

## ARIA

- Trigger: `aria-label`, `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls={panelId}`
- Panel: `role="dialog"`, `id={panelId}`, `popover="auto"`

## When to Use

- Use to add optional explanatory content next to a field, label, or concept
- Use when help should not occupy persistent space in the layout
- Use when the help is short and self-contained

## When Not to Use

- Do not use for required instructions — show those inline as `Hint` text
- Do not use for blocking confirmations — use `Dialog` or `AlertDialog`
- Do not use for guided tours — use `Coachmark` or `Tour`

## Headless

Renders a `<button>` trigger and a `<div role="dialog" popover="auto">` panel linked by `aria-controls` and
`commandfor`. The browser owns open, Escape and light dismiss. Positioning relative to the trigger (CSS anchor
positioning works well), animation, the trigger glyph and all visual treatment are the consumer's.

## Styles

Consumer CSS targets the `contextual-help` wrapper, `contextual-help-trigger`
button, and `contextual-help-panel` panel classes. Provide a clear focus
indicator on the trigger and ensure the panel is reachable by keyboard.

## Testing

- Verify the wrapper renders a `<div>` with class `contextual-help`
- Verify the trigger renders a `<button>` with `aria-label={label}` and the text `triggerLabel`
- Verify the trigger has `aria-haspopup="dialog"`, `aria-controls`, `command="toggle-popover"`, `commandfor` and `popovertarget` naming the panel
- Verify `aria-expanded` on the trigger reflects `expanded`, and follows the panel's `toggle` event
- Verify the panel renders with `role="dialog"`, `popover="auto"` and the matching id
- Verify the `hidden` fallback where the Popover API is missing
- Verify the panel id is stable

## Advice

- **Designers**: Use a recognizable help affordance (e.g., a question mark in a circle, written in the reader's script: `؟` in Arabic); do not rely on color alone.
- **Developers**: Generate panel ids server-side or with `useId` to remain hydration-stable.

## Related components

- `tooltip` — a small popup showing descriptive text on hover or focus
- `popover` — a floating content box anchored to a trigger element
- `details` — a disclosure widget that shows and hides content

## References

- WAI-ARIA Dialog: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- Adobe Spectrum Contextual Help: https://spectrum.adobe.com/page/contextual-help/
- WCAG 1.3.1 Info and Relationships: https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships

---

Lily™ and Lily Design System™ are trademarks.
