# KbdShortcut

KbdShortcut renders a keyboard shortcut such as Ctrl + K as an outer `<kbd>` holding one inner `<kbd>` per key with a decorative separator between them. Use `kbd` for a single key reference.

**Status:** beta — implemented and unit-tested in the Svelte canonical; ports to the other frameworks pending (2026-10-05)

## Implementation Notes

- Root `<kbd class="kbd-shortcut">` containing, per key, `<kbd class="kbd-shortcut-key">`
- Between keys: `<span class="kbd-shortcut-separator" aria-hidden="true">` containing `separator` (default `+`)
- Optional `label` becomes `aria-label` on the root as the spoken form; absent, screen readers read the keys
- Spreads `restProps` onto the root

## Props

- `className`: string (default: `""`) -- CSS class name appended to the base class
- `keys`: string[] (required) -- the key names, in order
- `separator`: string (default: `"+"`) -- decorative separator between keys
- `label`: string (optional) -- spoken form, applied as `aria-label`
- `...restProps`: unknown -- additional attributes spread onto the root

## Usage

```html
<KbdShortcut keys={["Ctrl", "K"]} label="Control K" />
<KbdShortcut keys={["G", "H"]} separator=" then " />
```

## Keyboard Interactions

- None. KbdShortcut is a passive display element

## ARIA

- Separators are `aria-hidden="true"` so they are not read
- `aria-label={label}` -- optional spoken form on the root

## When to Use

- Use to show a multi-key shortcut in menus, help panels and command palettes.
- Use where the keys, order and separator should be consistent.
- Use in onboarding that teaches shortcuts.

## When Not to Use

- Do not use for a single key -- use `kbd`.
- Do not use for code or commands -- use `code` or `code-block`.
- Do not use to make a shortcut work -- it only displays one.

## Headless

This headless component renders nested `<kbd>` elements. Keycap appearance, spacing and separator styling are consumer CSS; no key icons are bundled.

## Styles

The consumer provides all CSS styling via `.kbd-shortcut`, `.kbd-shortcut-key` and `.kbd-shortcut-separator`.

## Testing

- Verify the root is a `<kbd>` with class `kbd-shortcut`
- Verify one inner `kbd-shortcut-key` per key, in order
- Verify separators only between keys, default `+`, configurable, `aria-hidden`
- Verify `label` becomes `aria-label`
- Verify pass-through attributes

## Advice

- **Designers**: Style platform-appropriate key names; show Cmd on macOS and Ctrl elsewhere.
- **Developers**: Detect the platform in your app and pass the right `keys`; this component does no detection or localisation.

## Related components

- `kbd` — a single key
- `code` — inline code
- `menu` — menus that often show shortcuts

## References

- MDN kbd element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/kbd

---

Lily™ and Lily Design System™ are trademarks.
