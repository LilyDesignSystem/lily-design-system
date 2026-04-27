# FloatButton

A floating action button anchored to a viewport corner. Renders a native `<button>` with `position: fixed` and the appropriate corner offsets.

## Implementation Notes

- Headless: the only inline styles are `position: fixed` plus a `1rem` offset for the chosen corner
- `label` is **required** and non-optional in the TypeScript interface
- The chosen corner is exposed as `data-position` so consumers can style or override anchoring with their own CSS
- Defaults to `type="button"` to avoid accidental form submissions

## Props

- `label`: string (**required**) — accessible name (aria-label)
- `position`: `"top-left" | "top-right" | "bottom-left" | "bottom-right"` (default `"bottom-right"`)
- `disabled`: boolean (default `false`)
- `type`: `"button" | "submit" | "reset"` (default `"button"`)
- default slot — icon content
- `...$attrs` — additional HTML attributes

## Events

- `click(event: MouseEvent)`

## Usage

```vue
<FloatButton label="Help" @click="openHelp">
    ?
</FloatButton>

<FloatButton label="Add" position="bottom-right" @click="add">
    <svg>…</svg>
</FloatButton>
```

## Keyboard Interactions

- `Tab` — focus the button
- `Enter` / `Space` — activate the button

## ARIA

- Native `<button>` semantics
- `aria-label` is the accessible name (required)

## When to Use

- A persistent primary action (compose, add, help) that should always be reachable

## When Not to Use

- Local actions that belong inside content — use `Button` or `IconButton`

## Headless

The component sets only the bare minimum inline styles needed to anchor the button. Consumers supply icon content and all other visual styling.

## Testing

- Verify the root `float-button` class and `aria-label`
- Verify default `type="button"`
- Verify `data-position` and corner offset styles
- Verify the click event is emitted

## References

- [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [Ant Design FloatButton](https://ant.design/components/float-button)
