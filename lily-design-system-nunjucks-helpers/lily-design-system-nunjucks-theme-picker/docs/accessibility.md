# Accessibility

The picker targets WCAG 2.2 AAA and follows the WAI-ARIA Authoring
Practices 1.2 Radio Group pattern.

## Roles and properties

| Element                       | Role / Property            | Source        |
| ----------------------------- | -------------------------- | ------------- |
| `<fieldset>`                  | `role="radiogroup"`        | Macro         |
| `<fieldset>`                  | `aria-label="{label}"`     | `opts.label`  |
| `<input type="radio">`        | implicit `role="radio"`    | Browser       |
| `<input type="radio">`        | `aria-checked` (implicit)  | Browser       |
| `<input type="radio">` × N    | shared `name`              | Macro         |

The macro does not add ARIA where native semantics already cover
the need. There is no `aria-pressed`, no roving `tabindex`, no
manual focus management — the native radio behaviour is exactly
the WAI-ARIA Authoring Practices pattern.

## Keyboard contract

Provided entirely by the platform's native radio inputs:

| Key                | Action                                            |
| ------------------ | ------------------------------------------------- |
| `Tab`              | Move focus into / out of the group.               |
| `Shift+Tab`        | Move focus backwards out of the group.            |
| `Arrow Down/Right` | Move selection to the next option.                |
| `Arrow Up/Left`    | Move selection to the previous option.            |
| `Space`            | Re-select the focused option (rarely needed).     |
| `Home` / `End`     | Move to first / last option (most browsers).      |

## State signals

The active state is exposed in three independent channels — no
colour-only meaning is required:

1. `aria-checked` on the selected radio.
2. `data-theme="<slug>"` on the target element (default `<html>`).
3. The managed `<link>`'s `href` attribute.

## Internationalisation

- `opts.label` is consumer-supplied; pass a translated string.
- `opts.themeLabels` entries are consumer-supplied; localise the
  values.
- The macro never emits hardcoded natural-language strings,
  including the word "default".

## Visible focus

The helper does not suppress `:focus` or `:focus-visible` styling.
The consumer's CSS is responsible for the visible focus ring.
NHS-UK and Lily themes ship a high-contrast focus outline that
meets AAA.

## Reduced motion

The helper performs no animation. Theme CSS files are responsible
for respecting `prefers-reduced-motion` if they introduce
transitions on the `data-theme` swap.

## Screen-reader smoke test

- VoiceOver (macOS) announces the group as "{label}, radiogroup"
  and each option as "{labelFor(slug)}, radio button, selected /
  not selected".
- NVDA announces "{label} grouping" and each option similarly.
- Selection changes are announced because the underlying control
  state (checked) changes.

## Common mistakes to avoid

- **Replacing the fieldset with a div in the caller block.** The
  `{% call %}` block renders inside the fieldset; do not wrap a
  div *around* the macro invocation if you need group semantics.
- **Hiding the radio inputs with `display: none`.** That removes
  them from the accessibility tree. Use a visually-hidden pattern
  (`clip-path: inset(50%)` or the `.sr-only` recipe) instead.
- **Forgetting to translate `opts.themeLabels`.** The macro only
  knows what the consumer tells it; locale-aware copy is the
  consumer's responsibility.
- **Emitting `<script>` from the macro.** Forbidden. CSP
  `script-src` policies that forbid inline scripts must continue
  to work.
