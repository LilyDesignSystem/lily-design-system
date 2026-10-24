<script lang="ts">
    // ConvertFromDiv component
    //
    // A headless part of ConvertDiv: the source side of a conversion, holding the value and unit to convert from. Contract: a plain <div> with the base class and children.
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

<!-- ConvertFromDiv.svelte -->
<div
    class={`convert-from-div ${className}`}
    {...restProps}
>
    {@render children?.()}
</div>
