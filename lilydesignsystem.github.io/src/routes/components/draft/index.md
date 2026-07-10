# Draft

A draft is an early preliminary version of content such as an article, email, report, blog post, or document. The component wraps in-progress content so that authoring tools, reviewers, and downstream renderers can recognise it as not-yet-final and treat it accordingly (e.g., hide from public listings, render with a "Draft" badge, exclude from search, allow inline editing).

This headless component renders a `<div>` with class `draft`. The consumer supplies the draft content as children. The component does not own save state, autosave, or revision history — those belong to the consumer.

## Implementation Notes

- Uses `<div>` element with class `draft`
- `aria-label` describes the draft for screen readers when no visible heading is present
- The `data-status` attribute can carry a finer-grained editorial state (e.g., "in-progress", "review", "ready-to-publish")

## Props

- `label`: string (optional) -- accessible label for the draft
- `status`: string (optional) -- editorial state, exposed as `data-status` for consumer CSS/JS
- `children`: slot (required) -- draft content
- `...restProps`: Any additional HTML attributes

## Usage

```html
<Draft label="Draft article">
  <h1>Working title</h1>
  <p>Opening paragraph still needs a hook.</p>
</Draft>
```

With editorial state:

```html
<Draft label="Quarterly report" status="review">
  <p>Q1 figures pending finance sign-off.</p>
</Draft>
```

## Keyboard Interactions

- None -- drafts are content wrappers, not interactive

## ARIA

- `aria-label` -- describes the draft for screen readers when no visible heading is present

## When to Use

- Use to wrap in-progress content in an authoring or CMS context so downstream code can detect and treat draft state distinctly.
- Use to flag a section as preliminary so reviewers know it is open for comment or revision.
- Use to gate rendering of unfinished material in public listings, RSS feeds, or search indexes.

## When Not to Use

- Do not use for finished, published content — render the bare content without a wrapper.
- Do not use as a placeholder for loading content — use `skeleton` or `loading` instead.
- Do not use for a generic content container — use `container` or `content-block`.
- Do not use to mark form input drafts in progress — use `editable` or `editable-form`.

## Headless

This component provides a `<div>` element with optional `aria-label` and optional `data-status`, and zero visual styling. The consumer is responsible for all CSS (e.g., a "Draft" watermark, a tinted background, a side-rail badge) and for any persistence, autosave, or revision logic.

## Styles

The consumer provides all CSS styling. The component renders with a `.draft` class for targeting. The optional `data-status` attribute can drive variant styling. No default styles are included -- this is a fully headless component.

## Testing

- Verify the component renders a `<div>` element with class `draft`
- Verify `aria-label` is applied when provided
- Verify `data-status` reflects the status prop when provided
- Verify child content slots are rendered correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Make the draft state immediately apparent — a tinted background, a "Draft" badge, or a watermark all work; rely on text or icon, not colour alone (WCAG 1.4.1).
- **Developers**: Drive your CMS or build pipeline off the `.draft` class or `data-status` attribute to exclude drafts from production output. Do not rely on the wrapper to hide content automatically — that is the consumer's policy.

## Related components

- `question` — a question is anything that asks for information, invites a response, tests knowledge, etc.
- `answer` — an answer is anything that responds to a question, request, action, etc.
- `comment` — a comment is anything that expresses an opinion, observation, explanation, etc.
- `editable` — an inline-editable text element that toggles between view and edit modes
- `editable-form` — a form wrapper for inline editing of content

## References

- [MDN div element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div)

---

Lily™ and Lily Design System™ are trademarks.
