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

<!-- ChatList.svelte -->
<ol
    class={`chat-list ${className}`}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</ol>
