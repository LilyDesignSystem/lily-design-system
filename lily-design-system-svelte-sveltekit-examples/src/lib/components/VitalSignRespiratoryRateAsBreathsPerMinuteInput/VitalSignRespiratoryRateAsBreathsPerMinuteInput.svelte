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

<!-- VitalSignRespiratoryRateAsBreathsPerMinuteInput.svelte -->
<div class={`vital-sign-respiratory-rate-as-breaths-per-minute-input ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .vital-sign-respiratory-rate-as-breaths-per-minute-input {
        display: block;
    }
</style>
