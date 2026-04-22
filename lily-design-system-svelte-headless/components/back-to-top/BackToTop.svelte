<script lang="ts">
    import type { Snippet } from "svelte";

    let {
        class: className = "",
        label = undefined,
        href = "#",
        children,
        ...restProps
    }: {
        label?: string;
        href?: string;
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- BackToTop.svelte -->
<a
    class={`back-to-top ${className}`}
    aria-label={label}
    {href}
    {...restProps}
>
    {@render children()}
</a>
