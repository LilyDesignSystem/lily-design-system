<script setup lang="ts">
// Sonner component
//
// A headless toast notification region that provides a designated area where
// brief, non-intrusive messages appear to inform users of events, confirmations,
// or status updates. Renders a <div> with role="region" and aria-live="polite"
// so screen readers announce new notifications without interrupting current output.
// Used for success confirmations, error alerts, progress updates, and system messages.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name identifying the notification area via aria-label.
//   default slot. The toast notification content.
//   ...restProps — additional HTML attributes spread onto the <div>.
//
// Syntax:
//   <Sonner label="Notifications">
//     <div role="status">Message here.</div>
//   </Sonner>
//
// Examples:
//   <!-- Success notification -->
//   <Sonner label="Notifications">
//     <div role="status">File saved successfully.</div>
//   </Sonner>
//
//   <!-- Multiple stacked toasts -->
//   <Sonner label="Alerts">
//     {#each toasts as toast}
//       <div role="status">{toast.message}</div>
//     {/each}
//   </Sonner>
//
// Keyboard:
//   - None built-in — consumer should implement Escape to dismiss and navigation between toasts.
//
// Accessibility:
//   - role="region" defines the notification area as a named landmark
//   - aria-label identifies the notification area
//   - aria-live="polite" ensures new content is announced after current screen reader output
//
// Internationalization:
//   - The label prop externalizes the region name for localization
//   - Toast content comes through default slot for localization
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - No internal state — purely a structural wrapper
//   - Consumer manages toast lifecycle (appearance, auto-dismiss, manual dismiss)
//
// References:
//   - WAI-ARIA Live Regions: https://www.w3.org/TR/wai-aria-1.2/#aria-live
//   - WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region

defineProps<{
    label: string;
}>();
</script>

<template>
    <!-- Sonner.vue -->
    <div
        class="sonner"
        role="region"
        :aria-label="label"
        aria-live="polite"
    >
        <slot />
    </div>
</template>
