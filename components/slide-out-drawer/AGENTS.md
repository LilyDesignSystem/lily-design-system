# SlideOutDrawer

## Metadata

- Component: slide-out-drawer
- PascalCase: SlideOutDrawer
- Description: a drawer that slides out from the side of the page
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <dialog>
- CSS class: .slide-out-drawer
- Interactive: yes

## Key Behaviors

- Conditionally renders a native `<dialog>` only when `open` is true, and opens it with `showModal()` (falls back to the `open` attribute where `showModal` is missing)
- Supports two-way binding on the `open` prop
- Is modal: the page behind it is inert and Tab stays inside it while open, so `aria-modal="true"` is true
- Moves focus inside on open (the browser does it for `showModal()`; the fallback focuses the dialog) and returns focus to the opener on close
- Escape (keydown or the native `cancel` event) and the native `close` event (for example `<form method="dialog">`) set `open` to `false`
- Sets `tabindex="-1"` so the dialog itself can take focus when it has no focusable child
- Spreads rest props onto the `<dialog>`

## ARIA

- `role="dialog"` -- implicit on the native `<dialog>` element (not repeated as an attribute)
- `aria-label={label}` -- provides an accessible name for the dialog
- `aria-modal="true"` -- true: `showModal()` makes the page behind inert
- `tabindex="-1"` -- lets the dialog take focus

## Keyboard

- Escape: closes it by setting `open` to `false`
- Tab / Shift+Tab: move between focusable elements inside it; focus cannot leave while it is open

## Props

- `label`: string (required) -- accessible label for the dialog
- `open`: boolean (default: false) -- whether the drawer is visible, bindable
- `children`: slot (required) -- drawer content
- `...restProps`: Any additional HTML attributes spread onto the `<dialog>`

## Modality

- Decision (P18-T6): **modal**. A slide-out drawer overlays the page and asks for the user's attention until it is dismissed, so it is a real modal: a native `<dialog>` opened with `showModal()` (Svelte: `Dialog/modal.ts`; the other libraries use the same steps inline). The browser puts it in the top layer, makes the rest of the page inert, keeps Tab inside it, closes it on Escape (`cancel`), and focus returns to the element that opened it.
- Root element: changed from `<div role="dialog">` to `<dialog>` (the implicit role is `dialog`). No check pins the root tag (`bin/check-class-names` checks only the base class), and a slug without the `-dialog` suffix may still use `<dialog>`. Web Components keeps the custom-element host and renders the `<dialog class="slide-out-drawer">` inside it, as `lily-dialog` does; Nunjucks, HTML and Alpine open it from `data-open`.
- Where `showModal` does not exist (jsdom, very old engines) it falls back to the `open` attribute and focuses the dialog, so tests can run; that fallback is not modal.
- Theme CSS: a `<dialog>` brings user-agent styles (`margin: auto`, `inset-inline: 0`, `max-height`, a border). An edge-docked panel must reset them (for example `margin: 0; inset-inline-start: auto; max-block-size: none; border: 0`) and may style `::backdrop`.

## Native platform

- Decision: native
- Uses: <dialog> showModal() via Dialog/modal.ts (open-attribute fallback where showModal is missing)
- Could use: ::backdrop; command="show-modal"/"close" on consumer buttons
- Notes: P18-T6: same as drawer.
- Source: `spec/competitive-position/native-primitives.tsv` (P16-T4)

## Acceptance Criteria

- [ ] Renders <dialog> element with class="slide-out-drawer", opened with showModal()
- [ ] Has aria-label attribute
- [ ] Has role="dialog" (implicit) and aria-modal="true"
- [ ] Focus moves inside on open, cannot Tab out while open, and returns to the trigger on close
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .slide-out-drawer in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/slide-out-drawer.html
- WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- WAI-ARIA dialog role: https://www.w3.org/TR/wai-aria-1.2/#dialog
