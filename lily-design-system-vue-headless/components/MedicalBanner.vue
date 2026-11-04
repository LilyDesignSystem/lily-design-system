<script setup lang="ts">
// MedicalBanner component
//
// A headless medical banner for displaying prominent medical information
// messages at the top of a page. Renders as a <div role="region"> with
// aria-live="polite", data-type for variants, and data-context="medical".
// Supports optional dismiss functionality.
//
// Props:
//   label — string, required. Accessible name via aria-label.
//   type — "info" | "success" | "warning" | "error", default "info".
//   dismissible — boolean, default false.
//   closeLabel — string, optional. Accessible label for dismiss button.
//   onclose — () => void, optional. Callback when dismissed.
//
// Syntax:
//   <MedicalBanner label="Patient alerts">content</MedicalBanner>
//
// Keyboard:
//   - Tab: Focus dismiss button (when dismissible)
//   - Enter/Space: Dismiss the banner
//
// Accessibility:
//   - role="region" for landmark identification
//   - aria-live="polite" for announcing content changes
//   - data-context="medical" for medical context
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling

import { ref, useAttrs } from "vue";
import { warnMissingName } from "./dev-warning";

const props = withDefaults(
    defineProps<{
        label: string;
        type?: "info" | "success" | "warning" | "error";
        dismissible?: boolean;
        closeLabel?: string;
        onclose?: () => void;
    }>(),
    {
        type: "info",
        dismissible: false,
        closeLabel: undefined,
    },
);

warnMissingName(
    "MedicalBanner",
    props.label,
    useAttrs()["aria-label"],
    useAttrs()["aria-labelledby"],
);

const visible = ref(true);

function dismiss() {
    visible.value = false;
    props.onclose?.();
}
</script>

<template>
    <!-- MedicalBanner.vue -->
    <div
        v-if="visible"
        class="medical-banner"
        role="region"
        aria-live="polite"
        :aria-label="label"
        :data-type="type"
        data-context="medical"
    >
        <slot />
        <button
            v-if="dismissible"
            type="button"
            :aria-label="closeLabel"
            @click="dismiss"
        ></button>
    </div>
</template>
