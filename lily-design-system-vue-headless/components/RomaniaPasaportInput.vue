<script setup lang="ts">

    // RomaniaPasaportInput component
    //
    // A headless input for entering Romania's Paşaport.
    // Format: 8 characters: positions 1-2 [A-Z] and positions 3-8 [0-9].
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Romanian_passport

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
    <!-- RomaniaPasaportInput.vue -->
    <input
        class="romania-pasaport-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
