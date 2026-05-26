<script setup lang="ts">

    // EestiIsikukoodInput component
    //
    // A headless input for entering Estonia's Isikukood (IK).
    // Format: 11 digits in the form GYYMMDDSSSC: G is sex and century (odd male, even female; 1-2 19th c., 3-4 20th c., 5-6 21st c.), SSS distinguishes persons born the same day, C is a checksum.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identification_number#Estonia

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
    <!-- EestiIsikukoodInput.vue -->
    <input
        class="eesti-isikukood-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
