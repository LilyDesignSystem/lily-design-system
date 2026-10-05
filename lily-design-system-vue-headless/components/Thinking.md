# Thinking

a closed-by-default disclosure for an assistant's reasoning, with a streaming state

## Implementation Notes

- Native `<details>` / `<summary class="thinking-summary">` then `<div class="thinking-content">`
- `streaming` adds `data-streaming` and `aria-busy`
- Deviation: Vue has no two-way `open` binding on `<details>`, so the native `toggle` event is mirrored into the `open` model (Svelte uses `bind:open`)

## Props

- `label`: string (required) -- summary text
- `open` / `v-model:open`: boolean (default `false`)
- `streaming`: boolean (default `false`)
- default slot: content

## Usage

```vue
<Thinking label="Reasoning" streaming v-model:open="open">...</Thinking>
```

## Keyboard Interactions

- Enter / Space: toggle (native summary)

Canonical documentation: ../../components (see the component's `components/{slug}/index.md`).
