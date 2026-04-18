# Combobox

A combobox combines a text input with a dropdown listbox of suggestions, providing an autocomplete or type-ahead search experience. Users type into the input to filter suggestions, then select from matching options in the dropdown. This pattern is commonly used for search fields, address inputs, tag selectors, and any scenario where users choose from a large set of options.

The component manages the input value and dropdown open state as bindable props, so consumers can reactively filter options and control visibility. It supports full ARIA combobox semantics including `aria-expanded`, `aria-controls`, and `aria-autocomplete` for screen reader accessibility.

## Implementation Notes

- Renders a wrapper `<div>` containing an `<input>` with `role="combobox"` and a conditionally rendered `<div>` with `role="listbox"`.
- Generates a unique `listboxId` using random string for the `aria-controls` relationship between input and listbox.
- The `value` prop uses `$bindable("")` for two-way binding of the input text.
- The `open` prop uses `$bindable(false)` for two-way binding of dropdown visibility.
- The listbox is conditionally rendered with `{#if open}` to hide it from the DOM when closed.
- Escape key closes the dropdown via an `onkeydown` handler on the input.
- Spreads `restProps` onto the outer wrapper `<div>`.

## Props

- `label`: string (required) -- accessible name applied via `aria-label` on both the input and listbox.
- `value`: string (default: `""`) -- bindable current text input value.
- `open`: boolean (default: `false`) -- bindable dropdown visibility state.
- `children`: Snippet (required) -- option elements rendered inside the listbox dropdown.
- `...restProps`: unknown -- additional attributes spread onto the wrapper `<div>`.

## Usage

```svelte
<Combobox label="Search" bind:value bind:open>
    <div role="option" tabindex="-1">Option 1</div>
</Combobox>
```

```svelte
<script lang="ts">
    let value = $state("");
    let open = $state(false);
    let options = ["Apple", "Banana", "Cherry"];
    let filtered = $derived(options.filter(o => o.toLowerCase().includes(value.toLowerCase())));
</script>

<Combobox label="Select a fruit" bind:value bind:open>
    {#each filtered as option}
        <div role="option" tabindex="-1" onclick={() => { value = option; open = false; }}>
            {option}
        </div>
    {/each}
</Combobox>
```

## Keyboard Interactions

- Escape: Closes the dropdown listbox.

## ARIA

- `role="combobox"` -- on the `<input>`, identifies it as a combobox widget.
- `aria-label` -- provides an accessible name for both the input and the listbox.
- `aria-expanded` -- reflects the `open` state, telling screen readers whether the dropdown is visible.
- `aria-controls` -- links the input to its associated listbox by ID.
- `aria-autocomplete="list"` -- indicates the input provides autocomplete suggestions via a list.
- `role="listbox"` -- on the dropdown container, identifies it as a list of selectable options.

## References

- WAI-ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/combobox/
