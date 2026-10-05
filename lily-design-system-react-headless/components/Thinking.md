# Thinking

A collapsible block for a model's reasoning, on native `<details>`/`<summary>`. Closed by default.

## Props

- `className`: string (optional)
- `label`: string (required) -- summary text
- `open`: boolean (default `false`); `onChange(open)`
- `streaming`: boolean -- sets `data-streaming="true"` and `aria-busy="true"` on the root
- `children`: ReactNode -- inside `.thinking-content`
- `...restProps` -- spread onto `<details>`

## Implementation Notes

Deviation from the brief's naming: the open-state callback is `onChange` (as `Collapsible`/`Expander` do), not `onOpenChange`.

## Usage

```tsx
<Thinking label="Thinking" streaming={busy}>Step 1...</Thinking>
```

## Keyboard Interactions

Native summary: Enter / Space.

## Related components

`Collapsible`.
