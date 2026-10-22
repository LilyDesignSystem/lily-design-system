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

<!-- TreeListItem.svelte -->
<li class={`tree-list-item ${className}`} role="treeitem" tabindex="-1" aria-label={label} {...restProps}>
    {@render children?.()}
</li>
