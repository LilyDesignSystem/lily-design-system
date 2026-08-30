<script setup lang="ts">

    // CyprusNationalPassportNumberView component
    //
    // A headless display for Cyprus's National Passport Number.
    // Format: passports before 13/12/2010 begin with 'E' followed by 6 digits (e.g. E123456); biometric passports issued after 13/12/2010 begin with 'K' followed by 8 digits (e.g. K12345678).
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Cypriot_passport

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- CyprusNationalPassportNumberView.vue -->
    <span
        class="cyprus-national-passport-number-view"
        :aria-label="label">{{ value }}</span
    >
</template>
