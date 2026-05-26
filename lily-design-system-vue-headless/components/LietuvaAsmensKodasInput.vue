<script setup lang="ts">

    // LietuvaAsmensKodasInput component
    //
    // A headless input for entering Lithuania's Asmens kodas.
    // Format: 11 digits in the format GYYMMDDNNNC: G encodes sex and century (4 or 6 women, 3 or 5 men), YYMMDD is the date of birth, NNN is a serial, C is the check digit.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identification_number#Lithuania

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
    <!-- LietuvaAsmensKodasInput.vue -->
    <input
        class="lietuva-asmens-kodas-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
