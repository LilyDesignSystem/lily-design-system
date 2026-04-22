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

<!-- AiLabel.svelte -->
<div class={`ai-label ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .ai-label {
        display: block;
    }
</style>
