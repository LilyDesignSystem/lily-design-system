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

<!-- CodeBlock.svelte -->
<pre
    class={`code-block ${className}`}
    aria-label={label}
    {...restProps}
>
    {@render children?.()}
</pre>
