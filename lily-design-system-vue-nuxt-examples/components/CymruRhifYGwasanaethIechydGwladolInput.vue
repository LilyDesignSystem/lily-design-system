<script setup lang="ts">

    // CymruRhifYGwasanaethIechydGwladolInput component
    //
    // A headless input for entering Wales's Rhif y Gwasanaeth Iechyd Gwladol (Rhif GIG).
    // Format: 10 digits in 3-3-4 format with a Modulus-11 check digit (shared with England and the Isle of Man).
    //
    // References:
    //   - https://en.wikipedia.org/wiki/NHS_number

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
    <!-- CymruRhifYGwasanaethIechydGwladolInput.vue -->
    <input
        class="cymru-rhif-y-gwasanaeth-iechyd-gwladol-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
