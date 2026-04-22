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

<!-- VitalSignBodyFatAsPercentageInput.svelte -->
<div class={`vital-sign-body-fat-as-percentage-input ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .vital-sign-body-fat-as-percentage-input {
        display: block;
    }
</style>
