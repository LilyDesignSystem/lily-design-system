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

<!-- GrailLayoutBottomFooter.svelte -->
<div class={`grail-layout-bottom-footer ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .grail-layout-bottom-footer {
        display: block;
    }
</style>
