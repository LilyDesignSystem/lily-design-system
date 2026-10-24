<script lang="ts">
    // ConvertFromUnitDiv component
    //
    // A headless part of ConvertDiv: the unit to convert from, such as a select box of currencies or lengths. Contract: a plain <div> with the base class and children.
    // Converts nothing and carries no strings of its own; the consumer supplies the controls.
    import type { Snippet } from "svelte";

    let {
        class: className = "",
        children,
        ...restProps
    }: {

        /** The content. */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ConvertFromUnitDiv.svelte -->
<div
    class={`convert-from-unit-div ${className}`}
    {...restProps}
>
    {@render children?.()}
</div>
