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

<!-- VitalSignCholesterolAsHdlMmolPerLitreInput.svelte -->
<div class={`vital-sign-cholesterol-as-hdl-mmol-per-litre-input ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .vital-sign-cholesterol-as-hdl-mmol-per-litre-input {
        display: block;
    }
</style>
