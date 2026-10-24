# StepListItem

One step in a step list. Status is exposed as `data-status`. When `current=true`, `data-current` is set for your CSS and scripts. The component sets no `aria-current`: put `aria-current="step"` on the content inside if you want assistive technology to announce the active step.

## Implementation Notes

- Root element is `<li>` (must be a child of `StepList`'s `<ol>`)
- `data-status` is one of `"waiting" | "in-progress" | "finished" | "error"`
- `data-current` only when `current=true`

## Props

- `status`: `"waiting" | "in-progress" | "finished" | "error"` (default: `"waiting"`)
- `current`: boolean (default: `false`)
- `label`: string (optional) -- aria-label override
- `children`: ReactNode (optional) -- typically a title and description
- `...restProps`: Any additional HTML attributes passed to the `<li>`

## Usage

```tsx
<StepListItem status="in-progress" current>
  <strong>Profile</strong>
  <span>Add your photo and bio</span>
</StepListItem>
```

## Keyboard Interactions

None at the item level. Interactive children handle their own keyboard.

## ARIA

- `data-current` when `current=true`
- `aria-label` from the optional `label` prop
- `data-status` for consumer CSS styling hooks
