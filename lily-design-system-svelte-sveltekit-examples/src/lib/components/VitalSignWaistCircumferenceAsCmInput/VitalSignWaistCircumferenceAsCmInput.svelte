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

<!-- VitalSignWaistCircumferenceAsCmInput.svelte -->
<div class={`vital-sign-waist-circumference-as-cm-input ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .vital-sign-waist-circumference-as-cm-input {
        display: block;
    }
</style>
