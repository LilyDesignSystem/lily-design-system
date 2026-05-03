<script setup lang="ts">

    // SuperBanner component
    //
    // A high-priority page-level banner that interrupts the user with a
    // system-wide message. Renders <div role="alert" aria-live="assertive">
    // so assistive tech announces it immediately.
    //
    // Optional dismissable mode renders a close <button> that emits
    // 'dismiss' when activated; the consumer is responsible for removing
    // the banner from the DOM (the component does not manage its own
    // visibility).
    //
    // Props:
    //   label        — string, optional. Accessible label override.
    //   dismissable  — boolean, default false. Show a dismiss button.
    //   dismissLabel — string, default "Dismiss". aria-label for the button.
    //   default slot — banner content.
    //
    // Emits:
    //   dismiss — fired when the dismiss button is clicked.
    //
    // Accessibility:
    //   - role="alert" + aria-live="assertive" announces the banner immediately
    //
    // Claude rules:
    //   - Headless: no CSS, no styles — consumer provides all styling
    //   - Component does not own visibility state; consumer renders/unrenders
    //
    // References:
    //   - WAI-ARIA alert role: https://www.w3.org/TR/wai-aria-1.2/#alert

    withDefaults(defineProps<{
        /** Optional accessible label override. */
        label?: string;
        /** Show a dismiss button. */
        dismissable?: boolean;
        /** Accessible label for the dismiss button. */
        dismissLabel?: string;
    }>(), {
        label: undefined,
        dismissable: false,
        dismissLabel: "Dismiss",
    });

    const emit = defineEmits<{
        (e: "dismiss"): void;
    }>();

</script>

<template>
    <!-- SuperBanner.vue -->
    <div
        class="super-banner"
        role="alert"
        aria-live="assertive"
        :aria-label="label"
    >
        <slot />
        <button
            v-if="dismissable"
            type="button"
            class="super-banner-dismiss"
            :aria-label="dismissLabel"
            @click="emit('dismiss')"
        >
            ×
        </button>
    </div>
</template>
