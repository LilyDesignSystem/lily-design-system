<script setup lang="ts">

    // BulgariaEdinenGrazhdanskiNomerInput component
    //
    // A headless input for entering Bulgaria's Единен граждански номер / Edinen grazhdanski nomer (EGN).
    // Format: 10 digits: the first 6 are the date of birth (YYMMDD), the next 3 encode area and birth order (ninth digit even for boy, odd for girl), and the tenth is a check digit.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Unique_citizenship_number

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
    <!-- BulgariaEdinenGrazhdanskiNomerInput.vue -->
    <input
        class="bulgaria-edinen-grazhdanski-nomer-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
