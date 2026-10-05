<script lang="ts">
    // ToolCallName component
    //
    // A headless inner part of ToolCall: the name of the tool in a tool call, shown in the summary. Contract: a plain wrapper with the base class and children.
    // Draws nothing and carries no strings of its own; the consumer supplies the text.
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

<!-- ToolCallName.svelte -->
<span
    class={`tool-call-name ${className}`}

    {...restProps}
>
    {@render children?.()}
</span>
