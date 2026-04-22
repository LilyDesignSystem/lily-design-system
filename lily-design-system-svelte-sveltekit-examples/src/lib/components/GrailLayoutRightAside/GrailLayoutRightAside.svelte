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

<!-- GrailLayoutRightAside.svelte -->
<div class={`grail-layout-right-aside ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .grail-layout-right-aside {
        display: block;
    }
</style>
