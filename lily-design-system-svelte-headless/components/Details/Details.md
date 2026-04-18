# Details

A disclosure widget that reveals or hides additional content on demand. Built on the native HTML `<details>` and `<summary>` elements, this component provides progressive disclosure -- showing only what is necessary upfront and letting users expand sections for more information. Common use cases include FAQs, collapsible sections, advanced options, and supplementary explanations.

The native `<details>` element provides built-in accessibility support without requiring custom ARIA attributes. Screen readers automatically announce the expanded or collapsed state. The component exposes a bindable `open` prop so parent components can programmatically control or react to the disclosure state.

## Implementation Notes

- Renders native `<details>` and `<summary>` HTML elements for built-in browser accessibility
- Uses `$bindable()` on the `open` prop with Svelte's `bind:open` directive for two-way state synchronization
- The `summary` prop provides the clickable toggle text
- Accepts a `children` Snippet for the expandable content area
- Spreads `restProps` onto the `<details>` element for consumer customization
- Similar to Collapsible but uses a more generic, standards-based API

## Props

- `summary`: string (required) -- text displayed in the summary toggle
- `open`: boolean (default: false) -- whether the details section is expanded; bindable
- `children`: Snippet (required) -- content revealed when expanded

## Usage

```svelte
<Details summary="More information">
  <p>Additional details shown when expanded.</p>
</Details>
```

```svelte
<script lang="ts">
  let showAdvanced = $state(false);
</script>

<Details summary="Advanced options" bind:open={showAdvanced}>
  <p>Configure advanced settings here.</p>
</Details>

{#if showAdvanced}
  <p>Advanced options are currently visible.</p>
{/if}
```

## Keyboard Interactions

- Enter or Space: toggles the disclosure open/closed when the `<summary>` element is focused (native browser behavior)

## ARIA

- Native `<details>` and `<summary>` elements provide built-in ARIA semantics
- The browser automatically exposes the expanded/collapsed state to assistive technology
- No additional ARIA attributes are needed because the native elements handle accessibility

## References

- MDN details element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details
- MDN summary element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/summary
- WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/disclosure/
