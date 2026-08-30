<script setup lang="ts">

    // LatvijaPersonasKodsInput component
    //
    // A headless input for entering Latvia's Personas kods.
    // Format: 11 digits in the form DDMMYY-CZZZZ where the first 6 are the date of birth (DDMMYY) and C encodes the century (0 = 19th, 1 = 20th, 2 = 21st).
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identification_number#Latvia

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
    <!-- LatvijaPersonasKodsInput.vue -->
    <input
        class="latvija-personas-kods-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
