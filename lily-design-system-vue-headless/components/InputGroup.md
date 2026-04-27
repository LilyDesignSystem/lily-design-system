# InputGroup

A wrapper that places optional prefix and suffix addons around an input. Renders a `<div class="input-group" role="group">` with optional `<span class="input-group-prefix">` and `<span class="input-group-suffix">` wrappers around named slot content.

## Implementation Notes

- Headless: no CSS or styles
- `role="group"` with optional `aria-label` clusters the input and addons for assistive tech
- Prefix/suffix spans are only rendered when their slots are provided

## Props

- `label`: string (optional) — `aria-label` for the group
- named slot `prefix` — content before the input
- named slot `suffix` — content after the input
- default slot — the input element
- `...$attrs` — additional HTML attributes

## Usage

```vue
<InputGroup label="Price">
    <template #prefix>$</template>
    <input type="number" />
</InputGroup>

<InputGroup label="Search">
    <input type="search" />
    <template #suffix><button>Go</button></template>
</InputGroup>
```

## Keyboard Interactions

- None at the container level; the contained input handles input keyboard behavior.

## ARIA

- `role="group"`
- `aria-label` (optional)

## When to Use

- Currency, unit, or symbol prefixes/suffixes around inputs
- Search inputs with attached buttons or icons

## When Not to Use

- For multiple unrelated form controls — use `Fieldset`

## Headless

The component renders structural markup only. Consumers style the wrapper, prefix span, suffix span, and contained input via the documented CSS class names.

## Testing

- Verify root class and `role="group"`
- Verify `aria-label` pass-through
- Verify prefix and suffix conditional rendering
- Verify default slot input renders inside the group

## References

- [WAI-ARIA `role="group"`](https://www.w3.org/TR/wai-aria-1.2/#group)
