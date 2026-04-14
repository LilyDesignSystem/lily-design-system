# ScreenReaderSpan

A screen reader span is a visually hidden span of text intended for screen readers to provide more descriptive labels. It is used to supplement visual elements with additional context that is only announced to assistive technologies.

This headless component uses a `<span>` element that is visually hidden via CSS but remains accessible to screen readers.

## Implementation Notes

- Uses `<span>` element with visually-hidden CSS pattern
- Content is visible only to screen readers, not sighted users
- Does not use `display: none` or `visibility: hidden` (which would hide from screen readers too)
- Uses clip/overflow pattern to remain in the accessibility tree

## Props

- `children`: slot (required) -- the text content for screen readers
- `...restProps`: Any additional HTML attributes

## Usage

Icon-only button with screen reader label:

```html
<button>
  <Icon name="close" />
  <ScreenReaderSpan>Close dialog</ScreenReaderSpan>
</button>
```

Icon-only link with screen reader label:

```html
<a href="/home">
  <Icon name="home" />
  <ScreenReaderSpan>Home page</ScreenReaderSpan>
</a>
```

Expanding abbreviated text for screen readers:

```html
<p>Published <time datetime="2025-01-15">3 min<ScreenReaderSpan>utes</ScreenReaderSpan> ago</time></p>
```

Adding context to a "Read more" link:

```html
<article>
  <h3>Understanding ARIA landmarks</h3>
  <p>ARIA landmarks help assistive technology users navigate...</p>
  <a href="/articles/aria-landmarks">
    Read more<ScreenReaderSpan> about understanding ARIA landmarks</ScreenReaderSpan>
  </a>
</article>
```

## Keyboard Interactions

- None -- screen reader spans are informational, not interactive

## ARIA

- No ARIA attributes needed -- the text content itself provides the accessible information
- The visually-hidden pattern ensures the text stays in the accessibility tree

## When to Use

- Use to provide descriptive text for icon-only buttons or links.
- Use to add context that is visually implied but not explicit for screen readers.
- Use for table cells or list items where visual context makes the meaning obvious but screen readers need additional text.
- Use to expand abbreviated text such as "3 min" to "3 minutes" for assistive technologies.

## When Not to Use

- Do not use when a visible label is possible -- prefer visible text over hidden text.
- Do not use when `aria-label` or `aria-labelledby` on the interactive element would be more appropriate.
- Do not use to hide content from sighted users that they need to see.
- Do not use for decorative content that should be hidden from all users -- use `aria-hidden="true"` instead.

## Headless

This component provides a `<span>` element with zero visual presence but full screen reader accessibility. The consumer must apply the visually-hidden CSS pattern (clip, overflow, position absolute, dimensions) to hide the element visually.

## Styles

The consumer provides the visually-hidden CSS. The component renders with a `.screen-reader-span` class for targeting. The recommended CSS pattern is: `position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;`

## Testing

- Verify the component renders a `<span>` element with class `screen-reader-span`
- Verify child text content is rendered
- Verify the element is in the accessibility tree
- Verify pass-through attributes are applied

## Advice

- **Designers**: Identify icon-only controls that need supplementary text for screen readers. Document the intended screen reader text alongside visual designs.
- **Developers**: Prefer `aria-label` on interactive elements where possible. Use ScreenReaderSpan when you need inline text that participates in the DOM flow for screen readers.

## References

- WebAIM: CSS in Action - Invisible Content Just for Screen Readers: https://webaim.org/techniques/css/invisiblecontent/
