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
        /** Marks the currently selected conversation (aria-current="true"). */
        current?: boolean;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ChatListItem.svelte -->
<li
    class={`chat-list-item ${className}`}
    aria-label={label}
    aria-current={current ? "true" : undefined}
    {...restProps}
>
    {@render children?.()}
</li>
