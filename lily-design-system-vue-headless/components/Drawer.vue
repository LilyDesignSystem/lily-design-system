<script setup lang="ts">
// Drawer component
//
// A panel that slides in from an edge of the viewport, typically used for
// navigation menus, filters, or supplementary content. Renders conditionally
// based on the open state as a native <dialog> opened with showModal(), so it is
// really modal. The side prop indicates which edge via a
// data-side attribute for consumer positioning and animation styles.
//
// Props:
//   className — string, optional. CSS class name.
//   open — boolean, default false. Whether the drawer is visible; bindable.
//   label — string, required. Accessible name for the drawer.
//   side — "left" | "right" | "top" | "bottom", default "left". Edge the drawer enters from.
//   default slot. Drawer content.
//   ...restProps — additional HTML attributes spread onto the <dialog>.
//
// Syntax:
//   <Drawer label="Nav" v-model:open side="left">Content</Drawer>
//
// Examples:
//   <!-- Navigation drawer from left -->
//   <Drawer label="Navigation" v-model:open side="left">
//     <nav>...</nav>
//   </Drawer>
//
//   <!-- Filters drawer from right -->
//   <Drawer label="Filters" v-model:open={showFilters} side="right">
//     <form>...</form>
//   </Drawer>
//
// Keyboard:
//   - Escape: closes the drawer (keydown or the native cancel event)
//   - Tab: stays inside while open (showModal())
//
// Accessibility:
//   - role="dialog" provided natively by the <dialog> element
//   - aria-label provides the accessible name
//   - aria-modal="true" is true: showModal() makes the page behind inert and traps Tab
//   - focus moves inside on open and returns to the opener on close
//   - tabindex="-1" allows programmatic focus management
//   - data-side attribute conveys position for consumer styling
//
// Internationalization:
//   - The label prop accepts any string; consumers provide localized text
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Uses defineModel() on open for two-way state binding
//   - Drawer is removed from DOM when open is false
//   - Consumer uses data-side for positioning CSS
//
// References:
//   - WAI-ARIA Dialog Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/

import { nextTick, useAttrs } from "vue";
import { warnMissingName } from "./dev-warning";

const props = withDefaults(
    defineProps<{
        /** Accessible name for the drawer. */
        label: string;
        /** Edge the drawer enters from. */
        side?: "left" | "right" | "top" | "bottom";
    }>(),
    {
        side: "left",
    },
);

warnMissingName("Drawer", props.label, useAttrs()["aria-label"], useAttrs()["aria-labelledby"]);

const open = defineModel<boolean>("open", { default: false });

function onkeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
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
    <!-- Drawer.vue -->
    <dialog
        v-if="open"
        :ref="setDialog"
        class="drawer"
        tabindex="-1"
        :aria-label="label"
        aria-modal="true"
        :data-side="side"
        @keydown="onkeydown"
        @cancel="oncancel"
        @close="onclose"
    >
        <slot />
    </dialog>
</template>
