# ShowMore

A content region clamped to a shorter height with a button that reveals the rest.
The clamp is consumer CSS keyed on `data-expanded` on `.show-more-content`; the content stays in the accessibility tree; no inline styles.
See `components/show-more/index.md`.

## Parameters

- `MoreLabel`, `LessLabel`: string (both required, no default)
- `Expanded` / `ExpandedChanged`: bool, default false, `@bind-Expanded`
- `ChildContent`, `CssClass`, `AdditionalAttributes` (root)

Markup: `div.show-more > div.show-more-content#id[data-expanded] + button.show-more-button[type=button][aria-expanded][aria-controls]`. The id is generated per instance. Keyboard: native button.
