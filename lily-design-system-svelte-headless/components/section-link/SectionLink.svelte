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

<!-- SectionLink.svelte -->
<a
    class={`section-link ${className}`}
    aria-label={label}
    {href}
    {...restProps}
>
    {@render children()}
</a>
