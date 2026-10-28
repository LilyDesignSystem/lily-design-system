<script lang="ts">
    // Picture component
    //
    // A headless wrapper around the native picture element: the browser chooses among the source
    // children (by media query, image type or resolution) and falls back to the img child.
    // Draws nothing and carries no strings of its own; the consumer supplies the source and img
    // elements, including the img's alt text.
    import type { Snippet } from "svelte";

    let {
        class: className = "",
        children,
        ...restProps
    }: {
        /** The source elements, then one img with its alt, width and height. */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Picture.svelte -->
<picture
    class={`picture ${className}`}

    {...restProps}
>
    {@render children?.()}
</picture>
