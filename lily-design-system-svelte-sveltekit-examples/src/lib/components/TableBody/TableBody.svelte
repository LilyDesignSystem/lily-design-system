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

<!-- TableBody.svelte -->
<div class={`table-body ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .table-body {
        display: block;
    }
</style>
