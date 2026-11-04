<script setup lang="ts">
// Sheet component
//
// A headless sliding panel overlay that appears from an edge of the viewport,
// functioning as a modal dialog (a native <dialog> opened with showModal()). Conditionally rendered based on the open state,
// with Escape key to dismiss. Commonly used for navigation menus, settings panels,
// detail views, or filter interfaces that slide in from the top, right, bottom, or left.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible label for the sheet dialog via aria-label.
//   open — boolean, default false. Whether the sheet is visible; bindable via v-model:open.
//   side — "left" | "right" | "top" | "bottom", default "right". Which edge the sheet appears from.
//   default slot. Content to render inside the sheet.
//   ...restProps — additional HTML attributes spread onto the <dialog>.
//
// Syntax:
//   <Sheet label="Settings" v-model:open side="right">
//     <p>Sheet content</p>
//   </Sheet>
//
// Examples:
//   <!-- Left-side navigation sheet -->
//   <Sheet label="Navigation" v-model:open={navOpen} side="left">
//     <nav><a href="/">Home</a></nav>
//   </Sheet>
//
//   <!-- Bottom sheet for mobile actions -->
//   <Sheet label="Actions" v-model:open={actionsOpen} side="bottom">
//     <button>Share</button>
//     <button>Delete</button>
//   </Sheet>
//
// Keyboard:
//   - Escape: closes the sheet (keydown or the native cancel event)
//   - Tab: stays inside while open (showModal())
//
// Accessibility:
//   - role="dialog" provided natively by the <dialog> element
//   - aria-label provides an accessible name for the dialog
//   - aria-modal="true" is true: showModal() makes the page behind inert and traps Tab
//   - focus moves inside on open and returns to the opener on close
//   - tabindex="-1" allows programmatic focus on the dialog container
//   - data-side attribute exposes the side for CSS targeting
//
// Internationalization:
//   - The label prop externalizes the accessible label string
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Open uses defineModel() for two-way binding with v-model:open
//   - Focus trapping comes from showModal() (open-attribute fallback where it is missing, e.g. jsdom);
//     consumer implements slide-in animations via CSS
//   - Completely removed from DOM when closed ({#if open})
//
// References:
//   - WAI-ARIA Dialog (Modal) Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

import { nextTick, useAttrs } from "vue";
import { warnMissingName } from "./dev-warning";

const props = withDefaults(
    defineProps<{
        /** Accessible label. */
        label: string;
        /** Edge from which the sheet appears. */
        side?: "left" | "right" | "top" | "bottom";
    }>(),
    {
        side: "right",
    },
);

warnMissingName("Sheet", props.label, useAttrs()["aria-label"], useAttrs()["aria-labelledby"]);

const open = defineModel<boolean>("open", { default: false });

function onkeydown(event: KeyboardEvent) {
    if (event.key === "Escape" && !event.defaultPrevented) {
        event.preventDefault();
        open.value = false;
    }
}

// A real modal: showModal() puts the <dialog> in the top layer, makes the page behind it inert and traps Tab. Where
// showModal is missing (jsdom) fall back to the open attribute. Focus moves inside on open and returns to the element
// that had it when the panel opened, once it closes. A function ref, so this runs as the element mounts and unmounts.
let current: HTMLDialogElement | null = null;
let opener: HTMLElement | null = null;
function setDialog(el: unknown) {
    const node = el instanceof HTMLDialogElement ? el : null;
    if (node === current) return;
    if (current) {
        const old = current;
        if (old.open) {
            if (typeof old.close === "function") old.close();
            else old.removeAttribute("open");
        }
        if (opener && opener !== document.body && opener.isConnected) opener.focus();
        opener = null;
    }
    current = node;
    if (!node) return;
    opener = document.activeElement as HTMLElement | null;
    // showModal() throws on a dialog that is not in the document yet (its parent is still being mounted): wait a tick.
    if (node.isConnected) show(node);
    else void nextTick(() => current === node && show(node));
}
function show(node: HTMLDialogElement) {
    if (!node.open) {
        if (typeof node.showModal === "function") node.showModal();
        else node.setAttribute("open", "");
    }
    if (!node.contains(document.activeElement)) node.focus();
}

function oncancel(event: Event) {
    event.preventDefault();
    open.value = false;
}
function onclose() {
    open.value = false;
}
</script>

<template>
    <!-- Sheet.vue -->
    <dialog
        v-if="open"
        :ref="setDialog"
        class="sheet"
        :aria-label="label"
        aria-modal="true"
        tabindex="-1"
        :data-side="side"
        @keydown="onkeydown"
        @cancel="oncancel"
        @close="onclose"
    >
        <slot />
    </dialog>
</template>
