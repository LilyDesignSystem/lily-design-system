<script setup lang="ts">

    // MisrAlRaqmAlQawmiInput component
    //
    // A headless input for entering Egypt's National Number.
    // Format: 14 digits: century of birth, date of birth (YYMMDD), governorate code, a sequence number encoding sex by parity, and a check digit.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Egyptian_National_Identity_Card

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
    <!-- MisrAlRaqmAlQawmiInput.vue -->
    <input
        class="misr-al-raqm-al-qawmi-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
