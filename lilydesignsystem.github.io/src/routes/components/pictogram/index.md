# Pictogram

A pictogram is a `<figure>` that pairs an icon or illustration with a title
and description in a centered or side-by-side layout. The icon is the
required focal element; heading and description provide context.

Use it for feature lists, value propositions, "how it works" steps,
benefit grids, and any place a small illustrated unit communicates a
concept more clearly than text alone.

## Implementation Notes

- Uses a native `<figure>` element so the icon and caption are grouped semantically
- `icon` is **required** as a slot/snippet/ReactNode — it is NOT children
- Icon container has `aria-hidden="true"` because the icon is decorative; the accessible name comes from the heading or `label`
- `layout` is exposed as `data-layout` ("centered" | "side", default "centered") for consumer styling
- `label` is optional and overrides the implicit accessible name
- `children` (when provided) override the description in the caption

## Props

- `layout`: "centered" | "side" (default: "centered") -- icon position
- `heading`: string (optional) -- title text
- `description`: string (optional) -- body text
- `icon`: slot/snippet/ReactNode (**required**) -- the icon content
- `label`: string (optional) -- aria-label override
- `children`: slot (optional) -- overrides description if provided
- `...restProps`: any additional HTML attributes

## Usage

Centered pictogram:

```html
<Pictogram heading="Privacy" description="Your data stays yours.">
  {#snippet icon()}<svg>...</svg>{/snippet}
</Pictogram>
```

Side layout with custom caption content:

```html
<Pictogram layout="side" heading="Speed">
  {#snippet icon()}<svg>...</svg>{/snippet}
  <p>Loads in under a second on any connection.</p>
</Pictogram>
```

## Keyboard Interactions

- None (passive element); interactive children manage their own keyboard behavior.

## ARIA

- Implicit `figure` semantics from the `<figure>` element
- Icon container is `aria-hidden="true"` (decorative)
- Accessible name comes from the heading inside `<figcaption>` or from `label` if provided
- `data-layout` is a non-ARIA hook for consumer styling

## When to Use

- Use to introduce a feature, value, or step with a meaningful illustration.
- Use in three-up or four-up grids of capabilities.
- Use when the visual symbol genuinely aids comprehension.

## When Not to Use

- Do not use for purely decorative imagery without a heading or description — use Image.
- Do not use to convey critical information via the icon alone — heading and description should carry meaning.
- Do not put an interactive control in the icon slot; put it in children below the description.

## Headless

Renders a `<figure>` with an `aria-hidden` icon container, a `<figcaption>`
holding the heading and description (or children). Visual layout, icon
sizing, and typography are entirely the consumer's responsibility, with
`data-layout` as a hook for "centered" vs "side" arrangements.

## Styles

Consumer CSS targets the `pictogram` class. Use the
`data-layout="centered"` and `data-layout="side"` attribute selectors to
arrange the icon and caption. Style the inner `pictogram-icon`,
`pictogram-caption`, `pictogram-heading`, and `pictogram-description`
classes as needed.

## Testing

- Verify the component renders a `<figure>` element with class `pictogram`
- Verify `data-layout` reflects the `layout` prop (default "centered")
- Verify the icon container has `aria-hidden="true"` and class `pictogram-icon`
- Verify the heading renders inside `<figcaption>` as `<h3 class="pictogram-heading">` when provided
- Verify the description renders as `<p class="pictogram-description">` when provided
- Verify children replace the description when provided
- Verify `aria-label` is rendered when `label` is provided

## Advice

- **Designers**: Use a consistent icon family across pictograms in a grid. Maintain a stable caption height to keep grids aligned.
- **Developers**: Pass the icon via the dedicated `icon` slot/prop, not children. This keeps `aria-hidden` on the icon container without affecting other content.

## Related components

- `icon` — a container for displaying an icon
- `feature-photo` — see components.tsv
- `card` — a grouped content container with header, body, and footer areas

## References

- MDN `<figure>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figure
- MDN `<figcaption>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/figcaption
- MDN `aria-hidden`: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-hidden
- Mozilla Protocol Design System: https://protocol.mozilla.org/

---

Lily™ and Lily Design System™ are trademarks.
