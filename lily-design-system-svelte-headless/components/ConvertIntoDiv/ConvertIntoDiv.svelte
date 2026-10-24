<script lang="ts">
    // ConvertIntoDiv component
    //
    // A headless part of ConvertDiv: the target side of a conversion, holding the value and unit to convert into. Contract: a plain <div> with the base class and children.
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

<!-- ConvertIntoDiv.svelte -->
<div
    class={`convert-into-div ${className}`}
    {...restProps}
>
    {@render children?.()}
</div>
