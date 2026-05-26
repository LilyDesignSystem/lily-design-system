<script setup lang="ts">

    // DanmarkPersonnummerInput component
    //
    // A headless input for entering Denmark's Personnummer (CPR-nummer) (CPR).
    // Format: 10 digits in the format DDMMYYXXXX where the first 6 are the date of birth (DDMMYY).
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Personal_identification_number_(Denmark)

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
    <!-- DanmarkPersonnummerInput.vue -->
    <input
        class="danmark-personnummer-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
