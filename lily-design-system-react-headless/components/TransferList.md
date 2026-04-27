# TransferList

A dual list box for moving items between two lists. The component is a `role="group"` container with two `<section>` regions (source and target) and an optional `actions` slot between them. The consumer supplies the actual list contents and the move-buttons.

## Implementation Notes

- `label`, `sourceLabel`, `targetLabel`, `source`, and `target` are all non-optional
- Source and target are passed as `ReactNode` props (named slots), not children
- Each list region is a `<section>` with its own `aria-label`
- The actions container is only rendered when `actions` is provided

## Props

- `label`: string (**required**) -- aria-label for the group
- `sourceLabel`: string (**required**) -- aria-label for the source section
- `targetLabel`: string (**required**) -- aria-label for the target section
- `source`: ReactNode (**required**) -- source list content (typically a Listbox)
- `target`: ReactNode (**required**) -- target list content
- `actions`: ReactNode (optional) -- buttons between the two lists
- `...restProps`: Any additional HTML attributes passed to the root `<div>`

## Usage

```tsx
<TransferList
  label="Permissions"
  sourceLabel="Available"
  targetLabel="Selected"
  source={<Listbox>…</Listbox>}
  target={<Listbox>…</Listbox>}
  actions={
    <>
      <button onClick={moveRight} aria-label="Move right">→</button>
      <button onClick={moveLeft} aria-label="Move left">←</button>
    </>
  }
/>
```

## Keyboard Interactions

Keyboard interaction is delegated to the consumer's listbox and action buttons.

## ARIA

- `role="group"` on the root with `aria-label`
- Source: `<section>` with `aria-label={sourceLabel}`
- Target: `<section>` with `aria-label={targetLabel}`
