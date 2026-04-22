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

<!-- VitalSignVo2MaxAsMlPerKgPerMinuteInput.svelte -->
<div class={`vital-sign-vo2-max-as-ml-per-kg-per-minute-input ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .vital-sign-vo2-max-as-ml-per-kg-per-minute-input {
        display: block;
    }
</style>
