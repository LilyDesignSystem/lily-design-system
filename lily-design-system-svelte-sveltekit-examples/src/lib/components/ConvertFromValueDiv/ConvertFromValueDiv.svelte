<script lang="ts">
    // ConvertFromValueDiv component
    //
    // A headless part of ConvertDiv: the value to convert from, such as a text input holding the number of dollars. Contract: a plain <div> with the base class and children.
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

<!-- ConvertFromValueDiv.svelte -->
<div
    class={`convert-from-value-div ${className}`}
    {...restProps}
>
    {@render children?.()}
</div>
