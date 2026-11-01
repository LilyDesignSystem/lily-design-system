# Drawer

## Metadata

- Component: drawer
- PascalCase: Drawer
- Description: a panel that slides in from the edge of the screen
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <dialog>
- CSS class: .drawer
- Interactive: yes

## Key Behaviors

- Conditionally renders a native `<dialog>` only when `open` is true, and opens it with `showModal()` (falls back to the `open` attribute where `showModal` is missing)
- Supports two-way binding on the `open` prop
- Is modal: the page behind it is inert and Tab stays inside it while open, so `aria-modal="true"` is true
- Moves focus inside on open (the browser does it for `showModal()`; the fallback focuses the dialog) and returns focus to the opener on close
- Escape (keydown or the native `cancel` event) and the native `close` event (for example `<form method="dialog">`) set `open` to `false`
- Exposes `data-side` attribute for consumer CSS positioning (left, right, top, bottom)
- Sets `tabindex="-1"` so the dialog itself can take focus when it has no focusable child
- Spreads rest props onto the `<dialog>`

## ARIA

- `role="dialog"` -- implicit on the native `<dialog>` element (not repeated as an attribute)
- `aria-label={label}` -- provides an accessible name for the dialog
- `aria-modal="true"` -- true: `showModal()` makes the page behind inert
- `tabindex="-1"` -- lets the dialog take focus
- `data-side={side}` -- data attribute for consumer CSS styling based on position

## Keyboard

- Escape: closes it by setting `open` to `false`
- Tab / Shift+Tab: move between focusable elements inside it; focus cannot leave while it is open

## Props

- `open`: boolean (default: false) -- whether the drawer is visible, two-way bindable via `open`
- `label`: string (required) -- accessible name for the drawer
- `side`: "left" | "right" | "top" | "bottom" (default: "left") -- which edge the drawer enters from
- `children`: slot (required) -- drawer content

## Modality

- Decision (P18-T6): **modal**. A drawer overlays the page and asks for the user's attention until it is dismissed, so it is a real modal: a native `<dialog>` opened with `showModal()` (Svelte: `Dialog/modal.ts`; the other libraries use the same steps inline). The browser puts it in the top layer, makes the rest of the page inert, keeps Tab inside it, closes it on Escape (`cancel`), and focus returns to the element that opened it.
- Root element: changed from `<div role="dialog">` to `<dialog>` (the implicit role is `dialog`). No check pins the root tag (`bin/check-class-names` checks only the base class), and a slug without the `-dialog` suffix may still use `<dialog>`. Web Components keeps the custom-element host and renders the `<dialog class="drawer">` inside it, as `lily-dialog` does; Nunjucks, HTML and Alpine open it from `data-open`.
- Where `showModal` does not exist (jsdom, very old engines) it falls back to the `open` attribute and focuses the dialog, so tests can run; that fallback is not modal.
- Theme CSS: a `<dialog>` brings user-agent styles (`margin: auto`, `inset-inline: 0`, `max-height`, a border). An edge-docked panel must reset them (for example `margin: 0; inset-inline-start: auto; max-block-size: none; border: 0`) and may style `::backdrop`.

## Native platform

- Decision: native
- Uses: <dialog> showModal() via Dialog/modal.ts (open-attribute fallback where showModal is missing)
- Could use: ::backdrop; command="show-modal"/"close" on consumer buttons
- Notes: P18-T6: modal, so rendered as a <dialog> opened with showModal(): top layer, inert page, Tab trap, Escape (cancel) and focus return to the opener come from the browser. Root tag changed from <div> to <dialog> (no check pins it; Web Components keeps the custom-element host and puts the <dialog> inside, as lily-dialog does). data-side placement stays theme CSS; themes must now reset the UA dialog box (margin, inset-inline-start, max-height, border).
- Source: `spec/competitive-position/native-primitives.tsv` (P16-T4)

## Acceptance Criteria

- [ ] Renders <dialog> element with class="drawer", opened with showModal()
- [ ] Has aria-label attribute
- [ ] Has role="dialog" (implicit) and aria-modal="true"
- [ ] Focus moves inside on open, cannot Tab out while open, and returns to the trigger on close
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .drawer in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/drawer.html
- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
