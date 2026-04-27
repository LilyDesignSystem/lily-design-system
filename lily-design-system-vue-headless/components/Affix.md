# Affix

A wrapper that pins its content to a viewport position while the page scrolls. Uses CSS `position: sticky` as the headless pinning behavior.

## Implementation Notes

- Headless: the only inline styles are `position: sticky` plus `top` or `bottom`
- When neither `offsetTop` nor `offsetBottom` is provided, defaults to `top: 0`
- Both offsets are also exposed as `data-offset-top` / `data-offset-bottom` attributes for consumer CSS hooks

## Props

- `offsetTop`: number (px) — distance from top edge when affixed
- `offsetBottom`: number (px) — distance from bottom edge when affixed
- default slot — affixed content
- `...$attrs` — additional HTML attributes

## Usage

```vue
<Affix :offset-top="0">
    <header>Sticky header</header>
</Affix>

<Affix :offset-bottom="16">
    <button>Floating action</button>
</Affix>
```

## ARIA

None — Affix is purely structural.

## When to Use

- Sticky page headers, table of contents, action bars
- Any element you want to remain visible inside its scroll container

## When Not to Use

- Modal overlays — use `Dialog` or `Sheet`
- Always-visible viewport-fixed elements — use `FloatButton`

## Headless

Affix relies on the browser's native sticky positioning. Consumers may override the inline style with their own CSS or replace the behavior with JavaScript-driven sticky if needed.

## Testing

- Verify the root `affix` class
- Verify `position: sticky` is applied
- Verify `top` or `bottom` reflects the provided offset
- Verify `data-offset-top` / `data-offset-bottom` are emitted

## References

- [MDN: position: sticky](https://developer.mozilla.org/docs/Web/CSS/position#sticky_positioning)
- [Ant Design Affix](https://ant.design/components/affix)
