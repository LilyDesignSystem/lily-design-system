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

<!-- VitalSignBodyTemperatureAsCelciusView.svelte -->
<div class={`vital-sign-body-temperature-as-celcius-view ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .vital-sign-body-temperature-as-celcius-view {
        display: block;
    }
</style>
