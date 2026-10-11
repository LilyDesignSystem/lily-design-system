<script setup lang="ts">

    // AotearoaNationalHealthIndexInput component
    //
    // A headless input for entering New Zealand's National Health Index (NHI) Number.
    // Format: Seven-character identifier (three letters, four digits). The legacy AAANNNC format uses a Modulus-11 check digit over the six preceding characters; an expanded AAANNAX format (issued from July 2026) uses a Modulus-23 check digit instead, to extend the identifier space.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/NHI_Number

    withDefaults(defineProps<{
        label: string;
        required?: boolean;
        disabled?: boolean;
    }>(), {
        required: false,
        disabled: false,
    });

    const modelValue = defineModel<string>({ default: "" });

</script>

<template>
    <!-- AotearoaNationalHealthIndexInput.vue -->
    <input
        class="aotearoa-national-health-index-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
