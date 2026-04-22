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

<!-- VitalSignBloodPressureDiastolicAsMmhgView.svelte -->
<div class={`vital-sign-blood-pressure-diastolic-as-mmhg-view ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .vital-sign-blood-pressure-diastolic-as-mmhg-view {
        display: block;
    }
</style>
