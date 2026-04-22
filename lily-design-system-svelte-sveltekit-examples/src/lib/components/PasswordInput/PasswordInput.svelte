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

<!-- PasswordInput.svelte -->
<div class={`password-input ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .password-input {
        display: block;
    }
</style>
