<script setup lang="ts">

    // AddressographBox component
    //
    // A small printed block of patient identification details (name, date of birth, NHS number, etc.)
    // historically pressed from an addressograph-box plate onto clinical records.
    //
    // Props:
    //   label — string, optional. Accessible label via aria-label.
    //   default slot — component content.
    //
    // Accessibility:
    //   - native <div> semantics
    //   - aria-label exposes a screen-reader name when label is provided
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling

    withDefaults(defineProps<{
        /** Optional accessible label set on aria-label. */
        label?: string;
    }>(), {
        label: undefined,
    });

</script>

<template>
    <!-- AddressographBox.vue -->
    <div
        class="addressograph-box"
        :aria-label="label"
        v-bind="$attrs"
    >
        <slot />
    </div>
</template>
