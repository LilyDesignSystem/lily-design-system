# KbdShortcut

a keyboard shortcut rendered as a sequence of key caps

## Implementation Notes

- Outer `<kbd class="kbd-shortcut">`, one inner `<kbd class="kbd-shortcut-key">` per key
- `aria-hidden` separators between keys only

## Props

- `keys`: string[] (required)
- `separator`: string (default `"+"`)
- `label`: string (optional spoken form, `aria-label`)

## Usage

```vue
<KbdShortcut :keys="['Ctrl', 'K']" />
```

## Keyboard Interactions

- None beyond native behaviour

Canonical documentation: ../../components (see the component's `components/{slug}/index.md`).
