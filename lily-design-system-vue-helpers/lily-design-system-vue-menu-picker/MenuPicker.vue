<script lang="ts">
/** Arguments passed to the default slot (the panel's content) and the `icon` slot. */
export type SlotArgs = {
    /** Is the panel open? */
    open: boolean;
    /** Close the panel and return focus to the button. */
    close: () => void;
};

/** Alias matching the canonical Svelte helper's type name. */
export type ChildArgs = SlotArgs;

/** Public props for MenuPicker. See `spec/index.md` §4 for the contract. */
export type Props = {
    /** Accessible name for the button, the panel and the tooltip. */
    label: string;
    /**
     * Close the panel when a link, button or `[role="menuitem"]` inside it is activated. Add
     * `data-menu-picker-keep-open` to an element (or an ancestor) to opt it out. Default `true`.
     */
    closeOnSelect?: boolean;
    /** Extra CSS class on the root element. */
    class?: string;
};

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextMenuPickerId(): string {
    uid += 1;
    return `menu-picker-${uid}`;
}

/** The selector for focusable things inside the panel. */
export const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { IconButton } from "@lilydesignsystem/vue-headless";
// Only the trigger button composes a headless primitive. The panel is a disclosure of whatever
// the app puts in it — links, buttons, forms — so it carries no ARIA menu roles (role="menu"
// would promise a roving-focus menuitem widget that arbitrary content is not). See spec/index.md §3.

const props = withDefaults(defineProps<Props>(), {
    closeOnSelect: true,
    class: "",
});

// `v-model:open` — the Vue idiom for the Svelte canonical's bindable `open`.
const open = defineModel<boolean>("open", { default: false });

const baseId = nextMenuPickerId();
const panelId = `${baseId}-panel`;
const tooltipId = `${baseId}-tooltip`;

// Tooltip: shown while the pointer is over the button or the tooltip itself (hoverable, WCAG
// 1.4.13) or while the button has keyboard focus; Escape dismisses it without moving focus;
// never shown while the popup is open, since the popup then explains the control.
const hoverButton = ref(false);
const hoverTooltip = ref(false);
const focusButton = ref(false);
const dismissed = ref(false);
const tooltipVisible = computed(
    () => !open.value && !dismissed.value && (hoverButton.value || hoverTooltip.value || focusButton.value),
);

function onTooltipButtonEnter(): void {
    hoverButton.value = true;
    dismissed.value = false;
}

function onTooltipButtonLeave(): void {
    hoverButton.value = false;
}

function onTooltipButtonFocus(event: FocusEvent): void {
    // Keyboard focus only: a mouse click also focuses the button in Chromium, and the tooltip
    // should not stick after a click.
    try {
        focusButton.value = (event.currentTarget as HTMLElement).matches(":focus-visible");
    } catch {
        focusButton.value = true; // engine without :focus-visible, err towards showing
    }
}

function onTooltipButtonBlur(): void {
    focusButton.value = false;
    dismissed.value = false;
}

function onTooltipKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape" && tooltipVisible.value) dismissed.value = true;
}

// WCAG 1.4.13: while the tooltip is visible, Escape dismisses it wherever focus is. The
// document listener exists only while visible. SSR-safe: watch callbacks run client-side only.
function onTooltipDocumentKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") dismissed.value = true;
}
let tooltipDocListening = false;
function setTooltipDocListener(on: boolean): void {
    if (typeof document === "undefined" || on === tooltipDocListening) return;
    tooltipDocListening = on;
    if (on) document.addEventListener("keydown", onTooltipDocumentKeydown);
    else document.removeEventListener("keydown", onTooltipDocumentKeydown);
}
watch(tooltipVisible, (visible) => setTooltipDocListener(visible), { flush: "sync" });
onBeforeUnmount(() => setTooltipDocListener(false));

// IconButton is a composition: a template ref on it resolves to whatever it defineExpose
// (`{ el }`), not the raw DOM node.
const buttonEl = ref<{ el?: HTMLButtonElement } | null>(null);
const panelEl = ref<HTMLDivElement | null>(null);
const rootEl = ref<HTMLDivElement | null>(null);

function focusables(): HTMLElement[] {
    return panelEl.value ? Array.from(panelEl.value.querySelectorAll<HTMLElement>(FOCUSABLE)) : [];
}

async function openPanel(focus: "none" | "first" | "last" = "none"): Promise<void> {
    open.value = true;
    if (focus === "none") return;
    // Wait for the DOM flush first — a `hidden` element cannot take focus.
    await nextTick();
    const all = focusables();
    (focus === "last" ? all[all.length - 1] : all[0])?.focus({ preventScroll: true });
}

async function closePanel(refocus = true): Promise<void> {
    if (!open.value) return;
    open.value = false;
    if (refocus) {
        await nextTick();
        buttonEl.value?.el?.focus({ preventScroll: true });
    }
}

async function onButtonClick(): Promise<void> {
    hoverButton.value = false;
    if (open.value) await closePanel();
    else await openPanel();
}

function onButtonKeydown(event: KeyboardEvent): void {
    onTooltipKeydown(event);
    if (event.key === "Escape" && open.value) {
        event.preventDefault();
        void closePanel();
    } else if (event.key === "ArrowDown") {
        // Enter and Space already produce a click; the arrows open and move into the panel.
        event.preventDefault();
        if (!open.value) void openPanel("first");
        else focusables()[0]?.focus({ preventScroll: true });
    } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (!open.value) void openPanel("last");
        else {
            const all = focusables();
            all[all.length - 1]?.focus({ preventScroll: true });
        }
    }
}

function onPanelKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
        event.preventDefault();
        void closePanel();
    } else if (event.key === "Tab") {
        // Focus goes to the button FIRST, without cancelling the key, so the browser continues
        // from the picker's position rather than from <body>.
        buttonEl.value?.el?.focus?.({ preventScroll: true });
        void closePanel(false);
    }
}

function onRootFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (next && rootEl.value?.contains(next)) return;
    void closePanel(false);
}

function onPanelClick(event: MouseEvent): void {
    if (!props.closeOnSelect) return;
    const target = event.target as Element | null;
    const hit = target?.closest?.('a[href], button, [role="menuitem"]');
    if (!hit || !panelEl.value?.contains(hit)) return;
    if (hit.closest("[data-menu-picker-keep-open]")) return;
    void closePanel();
}

function onDocumentClick(event: MouseEvent): void {
    if (!open.value) return;
    const t = event.target as Node | null;
    if (t && rootEl.value && !rootEl.value.contains(t)) void closePanel(false);
}

onMounted(() => {
    document.addEventListener("click", onDocumentClick);
});

onBeforeUnmount(() => {
    document.removeEventListener("click", onDocumentClick);
});

const slotArgs = computed<SlotArgs>(() => ({ open: open.value, close: () => void closePanel() }));
</script>

<template>
    <div
        ref="rootEl"
        :class="`menu-picker ${props.class}`.trim()"
        @focusout="onRootFocusOut"
    >
        <IconButton
            ref="buttonEl"
            baseClass="menu-picker-button"
            :label="label"
            :aria-expanded="open ? 'true' : 'false'"
            :aria-controls="panelId"
            @click="onButtonClick"
            @keydown="onButtonKeydown"
            @mouseenter="onTooltipButtonEnter"
            @mouseleave="onTooltipButtonLeave"
            @focus="onTooltipButtonFocus"
            @blur="onTooltipButtonBlur"
        >
            <slot name="icon" v-bind="slotArgs">
                <svg
                    class="menu-picker-icon"
                    viewBox="0 0 16 16"
                    width="1.05rem"
                    height="1.05rem"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M1.5 3.5h13M1.5 8h13M1.5 12.5h13" />
                </svg>
            </slot>
        </IconButton>

        <!-- Purely visual: the same text is already the button's aria-label, so it is not wired
             with aria-describedby (that would announce the name twice). -->
        <div
            class="menu-picker-tooltip"
            role="tooltip"
            :id="tooltipId"
            :hidden="tooltipVisible ? undefined : true"
            @mouseenter="hoverTooltip = true"
            @mouseleave="hoverTooltip = false"
        >{{ label }}</div>

        <!-- A named group, not a menu: the content is the app's. The handlers are pure delegation
             for whatever focusable content the app puts inside. -->
        <div
            ref="panelEl"
            class="menu-picker-panel"
            :id="panelId"
            role="group"
            :aria-label="label"
            :hidden="open ? undefined : true"
            @keydown="onPanelKeydown"
            @click="onPanelClick"
        >
            <slot v-bind="slotArgs" />
        </div>
    </div>
</template>
