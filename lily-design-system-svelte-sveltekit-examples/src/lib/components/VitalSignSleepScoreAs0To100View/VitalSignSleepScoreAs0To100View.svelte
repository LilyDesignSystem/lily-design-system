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

<!-- VitalSignSleepScoreAs0To100View.svelte -->
<div class={`vital-sign-sleep-score-as-0-to-100-view ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .vital-sign-sleep-score-as-0-to-100-view {
        display: block;
    }
</style>
