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

<!-- GrailLayoutLeftAside.svelte -->
<div class={`grail-layout-left-aside ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .grail-layout-left-aside {
        display: block;
    }
</style>
