# InputGroup

A wrapper that places optional prefix and suffix addons around an input. Renders a `<div role="group">` with optional `aria-label` so the bundle is announced as a single unit by assistive technologies. The actual input is provided as children; the addons are passed via `prefix` and `suffix`.

## Implementation Notes

- Renders `<div role="group">`
- Prefix addon is wrapped in `<span class="input-group-prefix">`
- Suffix addon is wrapped in `<span class="input-group-suffix">`
- The input is the consumer-supplied children

## Props

- `label`: string (optional) -- `aria-label` for the group
- `prefix`: ReactNode (optional) -- addon rendered before the input
- `suffix`: ReactNode (optional) -- addon rendered after the input
- `children`: ReactNode (required) -- the input element(s)
- `...restProps`: Any additional HTML attributes passed to the `<div>`

## Usage

```tsx
<InputGroup label="Amount" prefix={<span>$</span>} suffix={<span>USD</span>}>
  <input type="number" />
</InputGroup>

<InputGroup label="Search" prefix={<SearchIcon />} suffix={<button>Clear</button>}>
  <input type="search" />
</InputGroup>
```

## Keyboard Interactions

- None at the group level; the input and any addon controls handle their own keyboard input

## ARIA

- `role="group"`
- Optional `aria-label` via `label` prop
