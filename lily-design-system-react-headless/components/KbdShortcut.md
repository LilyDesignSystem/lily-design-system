# KbdShortcut

Displays a keyboard shortcut: an outer `<kbd class="kbd-shortcut">` with one inner `<kbd class="kbd-shortcut-key">` per key and `aria-hidden` separators between.

## Props

- `className`: string (optional)
- `keys`: string[] (required)
- `separator`: string (default `"+"`)
- `label`: string (optional) -- spoken form via `aria-label`; absent means screen readers read the keys
- `...restProps` -- spread onto the root `<kbd>`

## Usage

```tsx
<KbdShortcut keys={["Ctrl", "K"]} label="Control K" />
```

## Related components

`Kbd`.
