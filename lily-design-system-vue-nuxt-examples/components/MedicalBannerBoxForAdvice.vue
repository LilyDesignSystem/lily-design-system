<script setup lang="ts">
// MedicalBannerBoxForAdvice component
//
// A headless component for displaying routine medical record advice information
// such as contacts, contexts, care plans, and other advice-level clinical data.
// Renders a <div> with role="region", aria-label, and data-type="advice".
//
// Props:
//   label — string, required. Accessible name via aria-label.
//
// Syntax:
//   <MedicalBannerBoxForAdvice label="Care contacts">content</MedicalBannerBoxForAdvice>
//
// Keyboard:
//   - None (passive layout element)
//
// Accessibility:
//   - role="region" for landmark identification
//   - aria-label provides accessible name
//   - data-type="advice" for consumer CSS targeting
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
    <!-- MedicalBannerBoxForAdvice.vue -->
    <div
        class="medical-banner-box-for-advice"
        role="region"
        :aria-label="label"
        data-type="advice"
    >
        <slot />
    </div>
</template>
