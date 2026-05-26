<script setup lang="ts">

    // SlovenskoPasInput component
    //
    // A headless input for entering Slovakia's Pas.
    // Format: 9 characters in the format XXNNNNNNN: 2 block letters and 7 digits; valid for 10 years.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Slovak_passport

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
    <!-- SlovenskoPasInput.vue -->
    <input
        class="slovensko-pas-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
