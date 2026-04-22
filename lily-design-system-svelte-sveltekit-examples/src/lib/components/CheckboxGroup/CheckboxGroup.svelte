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

<!-- CheckboxGroup.svelte -->
<div class={`checkbox-group ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .checkbox-group {
        display: block;
    }
</style>
