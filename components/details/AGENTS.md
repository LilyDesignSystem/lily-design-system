# Details

## Metadata

- Component: details
- PascalCase: Details
- Description: a disclosure widget that shows and hides content
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <details>
- CSS class: .details
- Interactive: yes

## Key Behaviors

- Renders native `<details>` and `<summary>` HTML elements for built-in browser accessibility
- Supports two-way binding on the `open` prop for two-way state synchronization on the `open` prop
- The `summary` prop provides the clickable toggle text
- Accepts a `children` slot for the expandable content area
- Spreads `restProps` onto the `<details>` element for consumer customization
- Similar to Collapsible but uses a more generic, standards-based API

## ARIA

- Native `<details>` and `<summary>` elements provide built-in ARIA semantics
- The browser automatically exposes the expanded/collapsed state to assistive technology
- No additional ARIA attributes are needed because the native elements handle accessibility

## Keyboard

- Enter or Space: toggles the disclosure open/closed when the `<summary>` element is focused (native browser behavior)

## Props

- `summary`: string (required) -- text displayed in the summary toggle
- `open`: boolean (default: false) -- whether the details section is expanded; bindable
- `printOpen`: boolean (default: true) -- a printed page cannot open a closed disclosure, so on `beforeprint` a closed one is opened and on `afterprint` it is closed again (one the reader had opened stays open); pass false for content that should not print. Svelte, React, Solid, Vue, Angular, Web Components (`print-open="false"`) and Blazor (`PrintOpen`) (2026-11-21, P42-T9)
- `children`: slot (required) -- content revealed when expanded

## Native platform

- Decision: native
- Uses: <details>/<summary>
- Could use: name attribute for exclusive groups
- Notes: Open, close, keyboard and find-in-page reveal come from the browser.
- Source: `spec/competitive-position/native-primitives.tsv` (P16-T4)

## Mobile

- Apple: Native: `DisclosureGroup` ([mobile/components-mobile.tsv](../../mobile/components-mobile.tsv)).
- Android: `Disclosure(label, initiallyOpen) { … }` in `lily-compose`: a 48dp toggle with `expand`/`collapse` semantics actions, since Compose foundation has no disclosure.

## Acceptance Criteria

- [ ] Renders <details> element with class="details"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## Known limitations

Print opens the disclosure in the Svelte, React, Solid, Vue, Angular, Web Components and Blazor catalogs (`printOpen`, a shared `print-open`
module; in Blazor the element's script, which bUnit does not run). The HTML, Alpine and Nunjucks catalogs ship markup with no runtime for this
component, so the page does it once, from its own script:

```js
let reopened = [];
addEventListener("beforeprint", () => {
  reopened = [...document.querySelectorAll("details:not([open])")];
  reopened.forEach((d) => (d.open = true));
});
addEventListener("afterprint", () => reopened.forEach((d) => (d.open = false)));
```

## References

- Documentation: index.md
- CSS class: .details in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/details.html
- MDN details element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details
- MDN summary element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/summary
- WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
