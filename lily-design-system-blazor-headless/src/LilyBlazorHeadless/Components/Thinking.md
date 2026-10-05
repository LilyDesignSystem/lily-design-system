# Thinking

A collapsible block that shows an AI agent's reasoning, closed by default, built on native `<details>`.
See `components/thinking/index.md`.

## Parameters

- `Label`: string (required) — the `<summary>` text
- `Open` / `OpenChanged`: bool, default false, `@bind-Open`
- `Streaming`: bool — adds `data-streaming="true"` and `aria-busy="true"` to the root
- `ChildContent`, `CssClass`, `AdditionalAttributes`

Markup: `details.thinking > summary.thinking-summary + div.thinking-content`. Keyboard: native summary (Enter / Space).

## Deviation from Svelte

C# cannot read the live `open` property and `ontoggle` carries no new state, so `Open` is updated from the summary's `click` (which Enter / Space also raise), while the native toggle still happens (static rendering keeps working). A toggle by other means, such as browser find-in-page, does not update `Open`.
