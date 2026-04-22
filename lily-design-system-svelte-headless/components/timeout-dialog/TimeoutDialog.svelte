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

<!-- TimeoutDialog.svelte -->
<dialog
    class={`timeout-dialog ${className}`}
    aria-label={label}
    {...restProps}
>
    {@render children()}
</dialog>
