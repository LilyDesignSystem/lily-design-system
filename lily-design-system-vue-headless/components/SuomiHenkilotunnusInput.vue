<script setup lang="ts">

    // SuomiHenkilotunnusInput component
    //
    // A headless input for entering Finland's Henkilötunnus (HETU).
    // Format: 11 characters in the format DDMMYYCZZZQ: DDMMYY is the date of birth, C is the century sign (+, -, or A), ZZZ is an individual number (odd male, even female), Q is the checksum.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Personal_identity_code_(Finland)

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
    <!-- SuomiHenkilotunnusInput.vue -->
    <input
        class="suomi-henkilotunnus-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
