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

<!-- SectionListItem.svelte -->
<li
    class={`section-list-item ${className}`}
    aria-label={label}
    {...restProps}
>
    {@render children()}
</li>
