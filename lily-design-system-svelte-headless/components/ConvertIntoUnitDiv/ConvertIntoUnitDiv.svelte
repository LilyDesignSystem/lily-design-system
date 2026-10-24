<script lang="ts">
    // ConvertIntoUnitDiv component
    //
    // A headless part of ConvertDiv: the unit to convert into, such as a select box of currencies or lengths. Contract: a plain <div> with the base class and children.
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

<!-- ConvertIntoUnitDiv.svelte -->
<div
    class={`convert-into-unit-div ${className}`}
    {...restProps}
>
    {@render children?.()}
</div>
