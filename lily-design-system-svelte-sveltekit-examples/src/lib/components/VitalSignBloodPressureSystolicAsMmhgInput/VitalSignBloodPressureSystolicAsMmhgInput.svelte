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

<!-- VitalSignBloodPressureSystolicAsMmhgInput.svelte -->
<div class={`vital-sign-blood-pressure-systolic-as-mmhg-input ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .vital-sign-blood-pressure-systolic-as-mmhg-input {
        display: block;
    }
</style>
