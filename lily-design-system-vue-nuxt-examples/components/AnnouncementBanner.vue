<script setup lang="ts">
// AnnouncementBanner component
//
// A banner announcing news or a service notice. Renders a <div> with the `announcement-banner` hook;
//
// Props:
//   class — fallthrough attribute, optional. Vue merges it onto the root element with the base class hook.
//   label — string, optional. Accessible name, rendered as aria-label on the root.
//   default slot — required. The announcement.
//   attrs — additional HTML attributes (v-bind="$attrs") on the root <div>.
//
// Syntax:
//   <AnnouncementBanner label="…">…</AnnouncementBanner>
//
// Examples:
//   <AnnouncementBanner label="Service notice">The service is closed on Monday.</AnnouncementBanner>
//
// Keyboard:
//   - None -- not interactive; any interactive children handle their own keys
//
// Accessibility:
//   - aria-label comes from `label` when given
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//
// References:
//   - WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region

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
    <!-- AnnouncementBanner.vue -->
    <div
        class="announcement-banner"
        role="region"
        :aria-label="label"
    >
        <slot />
    </div>
</template>
