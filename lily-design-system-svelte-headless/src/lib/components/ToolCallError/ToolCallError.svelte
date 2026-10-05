<script lang="ts">
    // ToolCallError component
    //
    // A headless inner part of ToolCall: the error shown when a tool call fails. Contract: `role="alert"` announces the error when it appears (open the tool call on error so it is not hidden inside a closed `<details>`).
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

<!-- ToolCallError.svelte -->
<div
    class={`tool-call-error ${className}`}
    role="alert"
    {...restProps}
>
    {@render children?.()}
</div>
