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
<div class={`table-data ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .table-data {
        display: block;
    }
</style>
