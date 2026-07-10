# Contextual Help

A contextual help is a small help button — often a question-mark glyph —
that opens a popover with explanatory content for a nearby field, control,
or concept.

Use it next to labels and headings where users may need extra explanation
on demand without cluttering the primary UI. The help content is hidden by
default and revealed only when the user requests it.

## Implementation Notes

- Uses a `<div>` wrapper with class `contextual-help`
- The trigger is a `<button class="contextual-help-trigger" type="button">` with `aria-haspopup="dialog"`
- `expanded` reflects open state on the trigger via `aria-expanded`
- The trigger references the panel via `aria-controls={panelId}`
- The panel is a `<div class="contextual-help-panel" role="dialog">` and is hidden via the `hidden` attribute when closed
- The panel id is generated stably via `useId`, `crypto.randomUUID`, or a Math.random helper

## Props

- `label`: string (**required**) -- aria-label for the help trigger button
- `expanded`: boolean (default `false`) -- whether the popover is open
- `onClick` / `onclick`: callback (optional) -- trigger click handler
- `children`: slot -- popover content
- `...restProps`: any additional HTML attributes

## Usage

```html
<ContextualHelp
  label="Help for username"
  expanded={open}
  onClick={handleToggle}
>
  <h3>Username</h3>
  <p>Use 3-20 characters. Letters, numbers, and underscores only.</p>
</ContextualHelp>
```

## Keyboard Interactions

- Tab / Shift+Tab: Move focus into and out of the trigger and panel
- Enter / Space: Activate the trigger to toggle the popover
- Escape: (Consumer-provided) close the popover when open

## ARIA

- Trigger: `aria-label`, `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls={panelId}`
- Panel: `role="dialog"`, `id={panelId}`, `hidden` when closed

## When to Use

- Use to add optional explanatory content next to a field, label, or concept
- Use when help should not occupy persistent space in the layout
- Use when the help is short and self-contained

## When Not to Use

- Do not use for required instructions — show those inline as `Hint` text
- Do not use for blocking confirmations — use `Dialog` or `AlertDialog`
- Do not use for guided tours — use `Coachmark` or `Tour`

## Headless

Renders a `<button>` trigger and a `<div role="dialog">` panel linked by
`aria-controls`. Open/close state, positioning relative to the trigger,
animation, and visual treatment are entirely the consumer's responsibility.

## Styles

Consumer CSS targets the `contextual-help` wrapper, `contextual-help-trigger`
button, and `contextual-help-panel` panel classes. Provide a clear focus
indicator on the trigger and ensure the panel is reachable by keyboard.

## Testing

- Verify the wrapper renders a `<div>` with class `contextual-help`
- Verify the trigger renders a `<button>` with `aria-label={label}`
- Verify the trigger has `aria-haspopup="dialog"`
- Verify `aria-expanded` on the trigger reflects `expanded`
- Verify `aria-controls` on the trigger matches the panel id
- Verify the panel renders with `role="dialog"` and the matching id
- Verify the panel uses `hidden` when `expanded` is `false`
- Verify the panel id is stable

## Advice

- **Designers**: Use a recognizable help affordance (e.g., a question mark in a circle); do not rely on color alone.
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
