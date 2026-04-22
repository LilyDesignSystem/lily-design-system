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

<!-- VitalSignCholesterolAsLdlMmolPerLitreView.svelte -->
<div class={`vital-sign-cholesterol-as-ldl-mmol-per-litre-view ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .vital-sign-cholesterol-as-ldl-mmol-per-litre-view {
        display: block;
    }
</style>
