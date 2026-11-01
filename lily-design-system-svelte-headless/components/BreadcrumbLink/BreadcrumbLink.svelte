<script lang="ts">
    import type { Snippet } from "svelte";
    let {
        class: className = "",
        href,
        label = undefined,
        children,
        ...restProps
    }: {
        /** The URL to navigate to. */
        href: string;
        /** Accessible label override for screen readers. */
        label?: string;
        /** The link content. */
        children: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- BreadcrumbLink.svelte -->
<a
    class={`breadcrumb-link ${className}`}
    {href}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</a>
