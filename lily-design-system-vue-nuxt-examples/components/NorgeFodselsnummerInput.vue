<script setup lang="ts">

    // NorgeFodselsnummerInput component
    //
    // A headless input for entering Norway's Fødselsnummer.
    // Format: 11 digits where the first 6 represent the date of birth (DDMMYY).
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identification_number#Norway

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
    <!-- NorgeFodselsnummerInput.vue -->
    <input
        class="norge-fodselsnummer-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
