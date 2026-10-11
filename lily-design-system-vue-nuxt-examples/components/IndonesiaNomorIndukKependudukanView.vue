<script setup lang="ts">

    // IndonesiaNomorIndukKependudukanView component
    //
    // A headless display for Indonesia's Nomor Induk Kependudukan (NIK).
    // Format: 16 digits as PPKKCC-DDMMYY-NNNN: province/regency/sub-district code, date of birth (day +40 for a female holder), and a 4-digit sequence number. No published check digit.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/National_identification_number

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- IndonesiaNomorIndukKependudukanView.vue -->
    <span
        class="indonesia-nomor-induk-kependudukan-view"
        :aria-label="label">{{ value }}</span
    >
</template>
