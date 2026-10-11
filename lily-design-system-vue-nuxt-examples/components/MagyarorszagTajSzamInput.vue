<script setup lang="ts">

    // MagyarorszagTajSzamInput component
    //
    // A headless input for entering Hungary's Tarsadalombiztositasi Azonosito Jel (TAJ).
    // Format: 9 digits as SSS SSS SSK: an 8-digit serial number followed by a Modulus-10 check digit using alternating weights 3 and 7.
    //
    // References:
    //   - https://hu.wikipedia.org/wiki/T%C3%A1rsadalombiztos%C3%ADt%C3%A1si_azonos%C3%ADt%C3%B3_jel

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
    <!-- MagyarorszagTajSzamInput.vue -->
    <input
        class="magyarorszag-taj-szam-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
