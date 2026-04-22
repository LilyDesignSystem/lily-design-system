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

<!-- VitalSignSleepScoreAs0To100Input.svelte -->
<div class={`vital-sign-sleep-score-as-0-to-100-input ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .vital-sign-sleep-score-as-0-to-100-input {
        display: block;
    }
</style>
