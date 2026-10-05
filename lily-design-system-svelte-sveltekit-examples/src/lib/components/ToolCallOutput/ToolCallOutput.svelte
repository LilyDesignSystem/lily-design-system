<script lang="ts">
    // ToolCallOutput component
    //
    // A headless inner part of ToolCall: the output or result returned by a tool in a tool call. Contract: `label` (optional) sets `role="group"` and `aria-label`; without it neither is rendered.
    // Draws nothing and carries no strings of its own; the consumer supplies the text.
    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label = undefined,
        children,
        ...restProps
    }: {
        /** Accessible name of the group. */
        label?: string;
        /** The content. */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ToolCallOutput.svelte -->
<div
    class={`tool-call-output ${className}`}
    role={label ? "group" : undefined}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</div>
