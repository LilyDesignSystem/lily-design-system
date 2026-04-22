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

<!-- GrailLayout.svelte -->
<div class={`grail-layout ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .grail-layout {
        display: block;
    }
</style>
