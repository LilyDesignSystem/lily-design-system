<script lang="ts">
    // ToolCallStatus component
    //
    // A headless inner part of ToolCall: the status of a tool call as a word, such as pending, running, done or error. Contract: `status` (optional) sets `data-status`; the visible status word is the children (consumer text, never colour alone).
    // Draws nothing and carries no strings of its own; the consumer supplies the text.
    import type { Snippet } from "svelte";

    let {
        class: className = "",
        status = undefined,
        children,
        ...restProps
    }: {
        /** Status: pending, running, done or error. */
        status?: string;
        /** The content. */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ToolCallStatus.svelte -->
<span
    class={`tool-call-status ${className}`}
    data-status={status}
    {...restProps}
>
    {@render children?.()}
</span>
