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

<!-- MockupPhone.svelte -->
<div class={`mockup-phone ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .mockup-phone {
        display: block;
    }
</style>
