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

<!-- GrailLayoutTopHeader.svelte -->
<div class={`grail-layout-top-header ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .grail-layout-top-header {
        display: block;
    }
</style>
