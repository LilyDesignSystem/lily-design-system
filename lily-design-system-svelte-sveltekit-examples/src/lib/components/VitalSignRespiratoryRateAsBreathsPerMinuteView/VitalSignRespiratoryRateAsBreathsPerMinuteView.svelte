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

<!-- VitalSignRespiratoryRateAsBreathsPerMinuteView.svelte -->
<div class={`vital-sign-respiratory-rate-as-breaths-per-minute-view ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .vital-sign-respiratory-rate-as-breaths-per-minute-view {
        display: block;
    }
</style>
