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

<!-- VitalSignHeartRateAsBeatsPerMinuteView.svelte -->
<div class={`vital-sign-heart-rate-as-beats-per-minute-view ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .vital-sign-heart-rate-as-beats-per-minute-view {
        display: block;
    }
</style>
