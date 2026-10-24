<script lang="ts">
    // ConvertIntoValueDiv component
    //
    // A headless part of ConvertDiv: the converted value, such as a text input showing the number of euros. Contract: a plain <div> with the base class and children.
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

<!-- ConvertIntoValueDiv.svelte -->
<div
    class={`convert-into-value-div ${className}`}
    {...restProps}
>
    {@render children?.()}
</div>
