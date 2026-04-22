<script lang="ts">
    import type { Snippet } from "svelte";
    let {
        class: className = "",
        label = undefined,
        children,
        ...restProps
    }: {
        label?: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ChatMessage.svelte -->
<div class={`chat-message ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .chat-message {
        display: block;
    }
</style>
