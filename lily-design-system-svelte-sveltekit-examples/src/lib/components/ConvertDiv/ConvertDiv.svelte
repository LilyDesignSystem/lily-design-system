<script lang="ts">
    // ConvertDiv component
    //
    // A headless part of ConvertDiv: a group that converts a value from one unit into another, such as dollars into euros or miles into kilometres. Contract: a plain <div> with the base class and children; role="group" named by `label`.
    // Converts nothing and carries no strings of its own; the consumer supplies the controls.
    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label,
        children,
        ...restProps
    }: {
        /** Accessible name of the group (required). */
        label: string;

        /** The content. */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ConvertDiv.svelte -->
<div
    class={`convert-div ${className}`} role="group" aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
