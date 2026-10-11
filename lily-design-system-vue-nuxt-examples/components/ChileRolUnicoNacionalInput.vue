<script setup lang="ts">

    // ChileRolUnicoNacionalInput component
    //
    // A headless input for entering Chile's Rol Unico Nacional (RUN).
    // Format: 7 or 8 digits plus a trailing Modulus-11 check character computed with repeating weights 2-7 (K represents 10).
    //
    // References:
    //   - https://en.wikipedia.org/wiki/RUT

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
    <!-- ChileRolUnicoNacionalInput.vue -->
    <input
        class="chile-rol-unico-nacional-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
