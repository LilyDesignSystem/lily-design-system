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

<!-- TableFoot.svelte -->
<div class={`table-foot ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .table-foot {
        display: block;
    }
</style>
