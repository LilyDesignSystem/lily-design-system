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

<!-- VitalSignBodyTemperatureAsCelciusInput.svelte -->
<div class={`vital-sign-body-temperature-as-celcius-input ${className}`} aria-label={label} {...restProps}>
    {@render children()}
</div>

<style>
    .vital-sign-body-temperature-as-celcius-input {
        display: block;
    }
</style>
