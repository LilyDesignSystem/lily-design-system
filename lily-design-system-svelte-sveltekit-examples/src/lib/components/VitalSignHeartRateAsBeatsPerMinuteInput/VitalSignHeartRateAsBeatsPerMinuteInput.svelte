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

<!-- VitalSignHeartRateAsBeatsPerMinuteInput.svelte -->
<div class={`vital-sign-heart-rate-as-beats-per-minute-input ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .vital-sign-heart-rate-as-beats-per-minute-input {
        display: block;
    }
</style>
