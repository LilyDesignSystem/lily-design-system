<script setup lang="ts">
// TimeoutDialog component
//
// A modal dialog warning users before session timeout (ported from the Svelte reference, tasks.md P14-T4). The
// <dialog> is always rendered and shown while `open`: as a real modal with showModal() (top layer, inert page, Tab
// trapped) where the browser has it, else with the open attribute. Focus returns to the opener when it closes.
//
// Props:
//   label — string, optional. Accessible name via aria-label.
//   open — boolean, default false. Whether the dialog is shown.
//   default slot — the warning and its actions, supplied by the consumer.
//
// Accessibility: role="alertdialog" (the warning needs the user's response).
// Internationalization: no hardcoded strings; the label and content are the consumer's.
import { onMounted, ref, watch } from "vue";
import { hideDialog, showDialog } from "./dialog";

const props = withDefaults(
    defineProps<{
        label?: string;
        open?: boolean;
    }>(),
    {
        label: undefined,
        open: false,
    },
);

const el = ref<HTMLDialogElement | null>(null);
let opener: HTMLElement | null = null;

function sync(open: boolean): void {
    const node = el.value;
    if (!node) return;
    if (open && !node.open) {
        opener = document.activeElement as HTMLElement | null;
        showDialog(node);
    } else if (!open && node.open) {
        hideDialog(node);
        if (opener && opener !== document.body && opener.isConnected) opener.focus();
        opener = null;
    }
}

onMounted(() => sync(props.open));
watch(
    () => props.open,
    (open) => sync(open),
);
</script>

<template>
    <!-- TimeoutDialog.vue -->
    <dialog
        ref="el"
        class="timeout-dialog"
        role="alertdialog"
        :aria-label="label"
    >
        <slot />
    </dialog>
</template>
