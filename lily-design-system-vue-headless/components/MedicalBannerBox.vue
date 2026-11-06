<script setup lang="ts">
// MedicalBannerBox component
//
// A headless layout component designed to be placed inside a MedicalBanner.
// Renders a <div> with data-context="medical" that the consumer styles with
// flexbox horizontal layout to arrange medical banner content items side by side.
//
// Props:
//   label — string, optional. Accessible name via aria-label.
//
// Syntax:
//   <MedicalBannerBox>content</MedicalBannerBox>
//
// Keyboard:
//   - None (passive layout element)
//
// Accessibility:
//   - No additional ARIA required; parent MedicalBanner provides landmark
//   - Optional aria-label via label prop
//   - data-context="medical" for medical context
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling

withDefaults(
    defineProps<{
        label?: string;
    }>(),
    {
        label: undefined,
    },
);
</script>

<template>
    <!-- MedicalBannerBox.vue -->
    <div
        class="medical-banner-box"
        :role="label ? 'group' : undefined"
        :aria-label="label"
        data-context="medical"
    >
        <slot />
    </div>
</template>
