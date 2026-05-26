<script setup lang="ts">

    // LietuvaPasasInput component
    //
    // A headless input for entering Lithuania's Pasas.
    // Format: 8-digit passport or identity card number.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Lithuanian_passport

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
    <!-- LietuvaPasasInput.vue -->
    <input
        class="lietuva-pasas-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
