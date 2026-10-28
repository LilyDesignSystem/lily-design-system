<script setup lang="ts">
// MedicalBannerBoxForDanger component
//
// A headless component for displaying critical medical record danger information
// such as reactions, warnings, alarms, and other danger-level clinical alerts.
// Renders a <div> with role="region", aria-label, and data-type="danger".
//
// Props:
//   label — string, required. Accessible name via aria-label.
//
// Syntax:
//   <MedicalBannerBoxForDanger label="Allergies">content</MedicalBannerBoxForDanger>
//
// Keyboard:
//   - None (passive layout element)
//
// Accessibility:
//   - role="region" for landmark identification
//   - aria-label provides accessible name
//   - data-type="danger" for consumer CSS targeting
//
// Internationalization:
//   - label prop is the only user-facing string; no hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling

defineProps<{
    label: string;
}>();
</script>

<template>
    <!-- MedicalBannerBoxForDanger.vue -->
    <div
        class="medical-banner-box-for-danger"
        role="region"
        :aria-label="label"
        data-type="danger"
    >
        <slot />
    </div>
</template>
