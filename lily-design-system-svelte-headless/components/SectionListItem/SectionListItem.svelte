<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label = undefined,
        current = false,
        children,
        ...restProps
    }: {
        label?: string;
        current?: boolean;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- SectionListItem.svelte -->
<li
    class={`section-list-item ${className}`}


    data-current={current ? "" : undefined}
    {...restProps}
>
    {@render children?.()}
</li>
