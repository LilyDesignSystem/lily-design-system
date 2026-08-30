<script setup lang="ts">

    // NederlandPaspoortNummerInput component
    //
    // A headless input for entering Netherlands's Paspoort Nummer.
    // Format: 9 characters: positions 1-2 [A-Z] except 'O', positions 3-8 [A-Z 0-9] except 'O', position 9 [0-9].
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Dutch_passport

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
    <!-- NederlandPaspoortNummerInput.vue -->
    <input
        class="nederland-paspoort-nummer-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
