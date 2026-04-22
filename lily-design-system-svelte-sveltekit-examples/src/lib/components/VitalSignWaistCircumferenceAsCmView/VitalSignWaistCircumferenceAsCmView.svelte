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

<!-- VitalSignWaistCircumferenceAsCmView.svelte -->
<div class={`vital-sign-waist-circumference-as-cm-view ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .vital-sign-waist-circumference-as-cm-view {
        display: block;
    }
</style>
