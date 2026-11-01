# Warning Text

Warning text is a short warning about something important, such as the legal consequence of an action or of not acting: an icon and one bold line of text. It is the GOV.UK and DHCW warning-text pattern, headless.

**Status:** beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows.

The component renders a `<div>` holding an optional icon and a `<strong>` line. The consumer supplies the icon (Lily bundles none), the visually hidden prefix such as "Warning" in their own language, and the text. The component adds no ARIA beyond hiding the icon, draws nothing and carries no strings of its own.

## Implementation Notes

- Renders `<div class="warning-text {class}">`
- When an icon is supplied, it renders first, inside `<span class="warning-text-icon" aria-hidden="true">` (the Angular port always renders this wrapper, empty when nothing is projected into `[icon]`)
- The children render inside `<strong class="warning-text-text">`: the visually hidden prefix first, then the text
- `restProps` spread onto the root; no state, no behaviour, no live region
- The hidden prefix is content, not a prop, as in `warning-callout`: Lily ships no English default and no prop for it

## Props

| Prop           | Type            | Default | Description                                                     |
| -------------- | --------------- | ------- | --------------------------------------------------------------- |
| `class`        | string          | `""`    | Appended to the base class                                      |
| `icon`         | slot            | —       | Optional decorative icon, rendered inside an `aria-hidden` span |
| `children`     | slot            | —       | The visually hidden prefix, then the warning text               |
| `...restProps` | HTML attributes | —       | Spread onto the root `<div>`                                    |

## Usage

```svelte
<WarningText>
  {#snippet icon()}!{/snippet}
  <span class="visually-hidden">Warning</span>
  You can be fined up to £5,000 if you do not register.
</WarningText>
```

## Keyboard Interactions

- None. The element is not focusable.

## ARIA

- No role: the root is a plain `<div>`, read in page order with the content around it, so it is not announced when the page loads
- `aria-hidden="true"` on `.warning-text-icon`, so a glyph such as "!" is not read out
- The consumer's visually hidden prefix tells a screen reader user the kind of message before its text
- Do not put `aria-label` on the root: a `<div>` with no role cannot be named, and the label would replace nothing

## When to Use

- To warn users about something important near the action or decision it relates to, such as the legal consequences of an action, or of not taking one
- When the warning fits in one short line or sentence and needs no heading or further content

## When Not to Use

- Use `WarningCallout` — for a warning that needs a heading or several sentences, such as time-critical or health-affecting information on a content page
- Use `InsetText` — for helpful information that should stand out but is not a warning
- Use `Alert` — for a status message that appears or changes while the page is open and must be announced (`role="alert"`)
- Use `Notification` — for a brief message about an event or update outside the user's current task
- Use `ErrorMessage` and `ErrorSummary` — for errors in what the user entered
- Do not use for routine or reversible consequences, or repeat it so often on a page that it stops standing out

## Headless

This component decides semantics only: the elements, the class hooks and hiding the icon. It decides no icon, colour, size, weight, spacing or visually-hidden technique.

## Styles

Target `.warning-text`, `.warning-text-icon` and `.warning-text-text`. The `<strong>` is bold by default in browsers; keep it bold even where a reset removes user-agent styles. The reference themes do not restyle it yet. No default styles are included in the component.

## Testing

- Renders a `<div>` with class `warning-text` and appends the consumer class
- A supplied icon renders inside `.warning-text-icon` with `aria-hidden="true"`; with no icon, no wrapper is rendered
- The children render inside `strong.warning-text-text`, the hidden prefix included
- The component adds no text of its own; rest props reach the root

## Advice

- **Hidden prefix**: Put a visually hidden prefix such as "Warning" at the start of the content so a screen reader user hears the kind of message before its text. Lily ships no English and no prop for it: supply the string in your own language, hidden with your own visually-hidden class (clip it; never `display: none`, which hides it from screen readers too). GOV.UK notes you may need to rewrite the hidden text to fit your context.
- **Icon**: Supply the icon as text (GOV.UK and DHCW use "!" in a circle drawn with CSS) or an inline SVG. It is hidden from assistive technology, so it must not carry meaning the text lacks. Draw it with `currentColor` and the page background so it follows a user's colour overrides, and check it in forced-colours mode.
- **Dark backgrounds**: DHCW has a reverse variant for dark backgrounds; use the consumer class or a `data-*` attribute on the root for it.
- **Placement**: Keep it close to the action or decision it is about. Do not use it to report errors.

## Related components

- `warning-callout`
- `inset-text`
- `alert`
- `notification`
- `error-message`

## References

- [GOV.UK Design System: Warning text](https://design-system.service.gov.uk/components/warning-text/)
- [DHCW Design System: Warning callout, Warning text variant](https://dhcw-digital-health-and-care-wales.github.io/dhcw-design-system/components/warning-callout.html)
- [HTML strong element](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-strong-element)

---

Lily™ and Lily Design System™ are trademarks.
