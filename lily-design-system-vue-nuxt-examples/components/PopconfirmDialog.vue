<script setup lang="ts">

    // PopconfirmDialog component
    //
    // A popover dialog with confirm and cancel buttons. Uses
    // role="alertdialog" with aria-modal="false" because popconfirm is a
    // non-modal popover. Title and (optional) description are linked to the
    // container via aria-labelledby and aria-describedby with stable
    // generated ids.
    //
    // Props:
    //   open         — boolean, default false. Whether the dialog is open.
    //   title        — string, REQUIRED. Dialog heading text.
    //   description  — string, optional. Body text.
    //   confirmLabel — string, REQUIRED. Confirm button text.
    //   cancelLabel  — string, REQUIRED. Cancel button text.
    //   emits confirm() — emitted when confirm button is clicked.
    //   emits cancel()  — emitted when cancel button is clicked.
    //
    // Syntax:
    //   <PopconfirmDialog
    //     :open="open"
    //     title="Delete this item?"
    //     description="This action cannot be undone."
    //     confirm-label="Delete"
    //     cancel-label="Cancel"
    //     @confirm="onConfirm"
    //     @cancel="onCancel"
    //   />
    //
    // Accessibility:
    //   - role="alertdialog", aria-modal="false"
    //   - aria-labelledby points to the title heading
    //   - aria-describedby points to the description (when present)
    //
    // Internationalization:
    //   - All button labels and text content are consumer-supplied.
    //
    // Claude rules:
    //   - Headless: no CSS, no styles
    //   - title, confirmLabel, cancelLabel are required — non-optional
    //   - id values are generated per-instance for stable aria-* references
    //
    // References:
    //   - WAI-ARIA Alert Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/
    //   - Ant Design Popconfirm: https://ant.design/components/popconfirm

    withDefaults(defineProps<{
        /** Whether the dialog is open. */
        open?: boolean;
        /** Dialog heading text (REQUIRED). */
        title: string;
        /** Body text. */
        description?: string;
        /** Confirm button text (REQUIRED). */
        confirmLabel: string;
        /** Cancel button text (REQUIRED). */
        cancelLabel: string;
    }>(), {
        open: false,
        description: undefined,
    });

    defineEmits<{
        (e: "confirm"): void;
        (e: "cancel"): void;
    }>();

    const uid: string = Math.random().toString(36).slice(2, 9);
    const titleId: string = `popconfirm-dialog-title-${uid}`;
    const descId: string = `popconfirm-dialog-description-${uid}`;

</script>

<template>
    <!-- PopconfirmDialog.vue -->
    <div
        class="popconfirm-dialog"
        role="alertdialog"
        aria-modal="false"
        :aria-labelledby="titleId"
        :aria-describedby="description ? descId : undefined"
        :hidden="!open"
    >
        <h2
            class="popconfirm-dialog-title"
            :id="titleId"
        >
            {{ title }}
        </h2>
        <p
            v-if="description"
            class="popconfirm-dialog-description"
            :id="descId"
        >
            {{ description }}
        </p>
        <button
            class="popconfirm-dialog-cancel"
            type="button"
            @click="$emit('cancel')"
        >
            {{ cancelLabel }}
        </button>
        <button
            class="popconfirm-dialog-confirm"
            type="button"
            @click="$emit('confirm')"
        >
            {{ confirmLabel }}
        </button>
    </div>
</template>
