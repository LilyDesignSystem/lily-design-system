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

<!-- GrailLayoutCenterMain.svelte -->
<div class={`grail-layout-center-main ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .grail-layout-center-main {
        display: block;
    }
</style>
