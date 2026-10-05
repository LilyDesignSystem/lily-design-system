<script lang="ts">
    // Mark component
    //
    // A headless inline wrapper: an inline highlight marking text as relevant or referenced, such as a search match, using the native mark element. Contract: a plain wrapper with the base class and children.
    // Draws nothing and carries no strings of its own; the consumer supplies the text.
    import type { Snippet } from "svelte";

    let {
        class: className = "",
        children,
        ...restProps
    }: {

        /** The content. */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- Mark.svelte -->
<mark
    class={`mark ${className}`}

    {...restProps}
>
    {@render children?.()}
</mark>
