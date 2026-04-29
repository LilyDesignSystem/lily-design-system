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

<!-- TableTD.svelte -->
<div class={`table-th ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .table-th {
        display: block;
    }
</style>
