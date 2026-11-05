# Coachmark

## Metadata

- Component: coachmark
- PascalCase: Coachmark
- Description: an anchored popover that spotlights and explains a single feature
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <div> with role="dialog"
- CSS class: .coachmark
- Interactive: yes (dismiss button)

## Key Behaviors

- Renders a <div role="dialog"> with aria-modal="false"
- Renders title in <h2 class="coachmark-title"> and links via aria-labelledby
- Renders description (optional) in <p class="coachmark-description"> and links via aria-describedby
- Generates stable ids for title and description (useId / crypto.randomUUID / Math.random)
- Renders a dismiss button with aria-label={dismissLabel}
- The container is `popover="manual"`, shown while `open` (the hidden attribute where the Popover API is missing)
- Calls `onDismiss` when the dismiss button is activated

## ARIA

- `role="dialog"` on the container
- `aria-modal="false"` (non-blocking)
- `aria-labelledby` referencing the title id
- `aria-describedby` referencing the description id, only when description is provided
- `popover="manual"` shown while `open`; `hidden` where the Popover API is missing
- Dismiss button has `aria-label` via `dismissLabel`

## Keyboard

- Tab / Shift+Tab: Move focus into and out of the coachmark
- Enter / Space: Activate the dismiss button when focused
- Escape: (Consumer-provided) dismiss the coachmark

## Props

- `open`: boolean (default false)
- `title`: string (REQUIRED)
- `description`: string (optional)
- `dismissLabel`: string (REQUIRED)
- `onDismiss` / `ondismiss`: callback (optional)
- `...restProps`: any additional HTML attributes

## Native platform

- Decision: native
- Uses: div role="dialog" aria-modal="false" popover="manual" shown from the open state
- Could use: CSS anchor positioning to the spotlighted feature (consumer sets position-anchor)
- Notes: P16-T4 (2026-10-31): in Svelte, React, Vue, HTML, Alpine and Web Components, and Angular and Blazor where the component has the state (Angular: combobox, mentions-input, popconfirm-dialog, tree-select; Blazor: combobox, popconfirm-dialog; the rest are static stubs), always rendered with popover="manual". Nunjucks keeps the hidden attribute: its macros render the state on the server and have no script to call showPopover(), and a manual popover cannot be open in server-rendered HTML. Always rendered with popover="manual" and opened by the state through Popover/popover.ts, with the hidden attribute where the Popover API is missing (jsdom, older engines). Top layer removes z-index and overflow clipping; Escape and light dismiss stay the consumer's. manual, not auto: an onboarding step must not close on a stray click. Placement belongs in theme CSS (position-anchor).
- Source: `spec/competitive-position/native-primitives.tsv` (P16-T4)

## Acceptance Criteria

- [ ] Renders <div> element with role="dialog" and class="coachmark"
- [ ] aria-modal="false" is present
- [ ] Title is rendered in <h2 class="coachmark-title"> and linked via aria-labelledby
- [ ] Description (when provided) is rendered and linked via aria-describedby
- [ ] aria-describedby is absent when description is not provided
- [ ] hidden attribute reflects !open
- [ ] Dismiss button has aria-label={dismissLabel} and fires onDismiss
- [ ] Title and description ids are stable (useId / crypto.randomUUID / Math.random)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .coachmark in css-style-sheet-template.css
- Adobe Spectrum Coachmark: https://spectrum.adobe.com/page/coach-mark/
- WAI-ARIA Dialog: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
