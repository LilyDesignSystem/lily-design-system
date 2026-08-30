<script setup lang="ts">

    // AlbaCommunityHealthIndexInput component
    //
    // A headless input for entering Scotland's Community Health Index (CHI).
    // Format: 10 digits encoding date of birth (DDMMYY) + two random digits + a sex digit (odd male, even female) + a Modulus-11 check digit.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_Health_Service_Central_Register

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
    <!-- AlbaCommunityHealthIndexInput.vue -->
    <input
        class="alba-community-health-index-input"
        type="text"
        :aria-label="label"
        autocomplete="off"
        v-model="modelValue"
        :required="required"
        :disabled="disabled"
    />
</template>
