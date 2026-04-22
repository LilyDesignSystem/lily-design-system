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

<!-- VitalSignTotalSleepTimeAsMinPerDayView.svelte -->
<div class={`vital-sign-total-sleep-time-as-min-per-day-view ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .vital-sign-total-sleep-time-as-min-per-day-view {
        display: block;
    }
</style>
