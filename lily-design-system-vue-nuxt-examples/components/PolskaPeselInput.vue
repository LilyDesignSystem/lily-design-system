<script setup lang="ts">

    // PolskaPeselInput component
    //
    // A headless input for entering Poland's PESEL.
    // Format: 11 numeric digits; assigned shortly after birth and unchanged for life.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/PESEL

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
    <!-- PolskaPeselInput.vue -->
    <input
        class="polska-pesel-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
