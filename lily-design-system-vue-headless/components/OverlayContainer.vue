<script setup lang="ts">

    // OverlayContainer component
    //
    // A headless full-viewport overlay backdrop for modals, sheets, drawers,
    // and other dismissable surfaces. Renders <div role="presentation"> so the
    // wrapper itself is not announced; the actual modal child should provide
    // role="dialog" or similar. Consumers wire up the click-to-dismiss behavior
    // by listening for the click event.
    //
    // Props:
    //   open  — boolean, default false. Whether the overlay is visible.
    //   label — string, optional. aria-label.
    //   default slot — overlay content (typically a Dialog or Sheet).
    //   emits click(event) — used by consumers for backdrop-dismiss.
    //   ...restProps — additional HTML attributes spread onto the <div>.
    //
    // Syntax:
    //   <OverlayContainer :open="isOpen" @click="close">
    //     <Dialog>...</Dialog>
    //   </OverlayContainer>
    //
    // Examples:
    //   <!-- Modal overlay -->
    //   <OverlayContainer :open="isModalOpen" @click="closeModal">
    //     <div role="dialog">Hello</div>
    //   </OverlayContainer>
    //
    // Keyboard: None at this level — focus management belongs to the dialog
    // child.
    //
    // Accessibility:
    //   - role="presentation" so the backdrop itself is not announced
    //   - aria-hidden mirrors !open so closed overlays are skipped
    //   - hidden attribute removes the overlay from layout when closed
    //   - data-open exposes the open state for CSS hooks
    //
    // Internationalization:
    //   - label is consumer-supplied
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - Visibility is communicated via the hidden attribute and aria-hidden
    //
    // References:
    //   - WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

    withDefaults(defineProps<{
        /** Whether the overlay is visible. */
        open?: boolean;
        /** aria-label. */
        label?: string;
    }>(), {
        open: false,
        label: undefined,
    });

    defineEmits<{
        (e: "click", event: MouseEvent): void;
    }>();

</script>

<template>
    <!-- OverlayContainer.vue -->
    <div
        class="overlay-container"
        role="presentation"
        :data-open="open"
        :aria-hidden="!open"
        :hidden="!open"
        :aria-label="label"
        @click="$emit('click', $event)"
    >
        <slot />
    </div>
</template>
