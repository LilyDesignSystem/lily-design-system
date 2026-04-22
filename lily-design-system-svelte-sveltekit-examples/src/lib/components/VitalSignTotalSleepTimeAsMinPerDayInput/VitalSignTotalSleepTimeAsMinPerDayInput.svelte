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

<!-- VitalSignTotalSleepTimeAsMinPerDayInput.svelte -->
<div class={`vital-sign-total-sleep-time-as-min-per-day-input ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .vital-sign-total-sleep-time-as-min-per-day-input {
        display: block;
    }
</style>
