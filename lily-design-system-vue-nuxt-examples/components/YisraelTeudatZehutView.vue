<script setup lang="ts">

    // YisraelTeudatZehutView component
    //
    // A headless display for Israel's Teudat Zehut (תעודת זהות).
    // Format: Nine digits (left-padded with zeros when shorter), with the ninth a Luhn (Modulus-10) check digit: digits alternate between weights of 1 and 2 from the left, any doubled product over 9 has its own two digits summed, and the total must be a multiple of 10.
    //
    // References:
    //   - https://en.wikipedia.org/wiki/Israeli_identity_card

    withDefaults(defineProps<{
        label: string;
        value?: string;
    }>(), {
        value: "",
    });

</script>

<template>
    <!-- YisraelTeudatZehutView.vue -->
    <span
        class="yisrael-teudat-zehut-view"
        :aria-label="label">{{ value }}</span
    >
</template>
