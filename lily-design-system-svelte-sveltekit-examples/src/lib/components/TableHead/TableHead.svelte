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

<!-- TableHead.svelte -->
<div class={`table-head ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .table-head {
        display: block;
    }
</style>
