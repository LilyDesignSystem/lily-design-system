<script setup lang="ts">

    // Coachmark component
    //
    // An anchored popover that spotlights and explains a single feature.
    // Renders a non-modal dialog with a heading, optional description, and a
    // dismiss button. Title and description ids are generated for ARIA wiring.
    //
    // Props:
    //   open          — boolean, default false. Whether the coachmark is visible.
    //   title         — string, REQUIRED. Heading text.
    //   description   — string, optional. Body text.
    //   dismissLabel  — string, REQUIRED. Accessible label for the dismiss button.
    //   emits dismiss(event) — dismiss click handler.
    //
    // Syntax:
    //   <Coachmark :open="open" title="New feature"
    //              description="Try this out."
    //              dismiss-label="Dismiss"
    //              @dismiss="open = false" />
    //
    // Accessibility:
    //   - role="dialog", aria-modal="false"
    //   - aria-labelledby points at the title
    //   - aria-describedby points at the description (when provided)
    //   - hidden attribute toggles visibility
    //
    // Internationalization:
    //   - All visible and accessible text comes from props
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - title and dismissLabel are required

    const titleId = `coachmark-title-${Math.random().toString(36).slice(2, 9)}`;
    const descId = `coachmark-desc-${Math.random().toString(36).slice(2, 9)}`;

    withDefaults(defineProps<{
        /** Whether the coachmark is visible. */
        open?: boolean;
        /** Heading text (REQUIRED). */
        title: string;
        /** Body text. */
        description?: string;
        /** Accessible label for the dismiss button (REQUIRED). */
        dismissLabel: string;
    }>(), {
        open: false,
        description: undefined,
    });

    defineEmits<{
        (e: "dismiss", event: MouseEvent): void;
    }>();

</script>

<template>
    <!-- Coachmark.vue -->
    <div
        class="coachmark"
        role="dialog"
        aria-modal="false"
        :aria-labelledby="titleId"
        :aria-describedby="description ? descId : undefined"
        :hidden="!open"
    >
        <h2 class="coachmark-title" :id="titleId">{{ title }}</h2>
        <p v-if="description" class="coachmark-description" :id="descId">{{ description }}</p>
        <button
            class="coachmark-dismiss"
            type="button"
            :aria-label="dismissLabel"
            @click="$emit('dismiss', $event)"
        >×</button>
    </div>
</template>
