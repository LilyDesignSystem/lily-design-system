<script lang="ts">
/**
 * One destination in the list. The app defines them all: this package ships no routes and no
 * English — `label` is the consumer's text.
 */
export type LinkItem = {
    /** Stable identifier, passed back with the `navigate` event. Defaults to `href`. */
    id?: string;
    /** Visible link text. Consumer-supplied, so it localises. */
    label: string;
    /** Where the link goes: a route ("/about/") or a full URL. */
    href: string;
    /** Marks this link as the current page (`aria-current="page"`). */
    current?: boolean;
    /** Open in a new tab (`target="_blank"` with `rel="noopener noreferrer"`). */
    newTab?: boolean;
};

/** Arguments passed to the default scoped slot (the button icon). */
export type SlotArgs = {
    /** Is the list open? */
    open: boolean;
};

/** Alias matching the canonical Svelte helper's type name. */
export type ChildArgs = SlotArgs;

/** Public props for LinkPicker. See `spec/index.md` §4 for the contract. */
export type Props = {
    /** Accessible name for the button and the list. */
    label: string;
    /** The page links to offer. Defined by the app. */
    links: LinkItem[];
    /**
     * Client-side navigation hook, e.g. a router's `push`. When given, a plain left click on a
     * link calls `navigate(href)` instead of letting the browser load the page; modified clicks
     * (Ctrl/Cmd/Shift/Alt, middle button) and `newTab` links stay native.
     */
    navigate?: (href: string) => void;
    /** Extra CSS class on the root element. */
    class?: string;
};

/** The id a link reports: its explicit `id`, else its `href`. */
export function linkId(link: LinkItem): string {
    return link.id ?? link.href;
}

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextLinkPickerId(): string {
    uid += 1;
    return `link-picker-${uid}`;
}
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { IconButton } from "@lilydesignsystem/vue-headless";
// Only the trigger button composes a headless primitive. The list is real `<a>` navigation with
// a roving-focus pattern of its own — not an ARIA listbox or menu: role="menuitem" would strip
// middle-click, open-in-new-tab and copy-link-address from ordinary links. See spec/index.md §3.

const props = withDefaults(defineProps<Props>(), {
    navigate: undefined,
    class: "",
});

// The Svelte canonical takes an `onNavigate` callback prop; the Vue idiom for the same contract
// is an emitted event.
const emit = defineEmits<{
    (event: "navigate", id: string, href: string): void;
}>();

const baseId = nextLinkPickerId();
const listId = `${baseId}-list`;
const tooltipId = `${baseId}-tooltip`;

const open = ref(false);

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
const listEl = ref<HTMLUListElement | null>(null);
const rootEl = ref<HTMLDivElement | null>(null);

/** Every focusable link in the list, in DOM order. */
function items(): HTMLElement[] {
    if (!listEl.value) return [];
    return Array.from(listEl.value.querySelectorAll<HTMLElement>(".link-picker-link"));
}

async function openList(focusLast = false): Promise<void> {
    open.value = true;
    // Wait for the DOM flush first — a `hidden` element cannot take focus.
    await nextTick();
    const all = items();
    (focusLast ? all[all.length - 1] : all[0])?.focus({ preventScroll: true });
}

async function closeList(refocus = true): Promise<void> {
    if (!open.value) return;
    open.value = false;
    if (refocus) {
        await nextTick();
        buttonEl.value?.el?.focus({ preventScroll: true });
    }
}

async function onButtonClick(): Promise<void> {
    hoverButton.value = false;
    if (open.value) await closeList();
    else await openList();
}

function onButtonKeydown(event: KeyboardEvent): void {
    onTooltipKeydown(event);
    // Enter and Space already produce a click; only the arrows need handling here.
    if (event.key === "ArrowDown") {
        event.preventDefault();
        if (!open.value) void openList();
        else items()[0]?.focus({ preventScroll: true });
    } else if (event.key === "ArrowUp") {
        event.preventDefault();
        if (!open.value) void openList(true);
        else {
            const all = items();
            all[all.length - 1]?.focus({ preventScroll: true });
        }
    }
}

function moveFocus(delta: number): void {
    const all = items();
    if (all.length === 0) return;
    const i = all.indexOf(document.activeElement as HTMLElement);
    const next = Math.min(Math.max((i < 0 ? 0 : i) + delta, 0), all.length - 1);
    all[next]?.focus({ preventScroll: true });
}

function onListKeydown(event: KeyboardEvent): void {
    switch (event.key) {
        case "ArrowDown":
            event.preventDefault();
            moveFocus(1);
            break;
        case "ArrowUp":
            event.preventDefault();
            moveFocus(-1);
            break;
        case "Home":
            event.preventDefault();
            items()[0]?.focus({ preventScroll: true });
            break;
        case "End": {
            event.preventDefault();
            const all = items();
            all[all.length - 1]?.focus({ preventScroll: true });
            break;
        }
        case "Escape":
            event.preventDefault();
            void closeList();
            break;
        case "Tab":
            // Focus goes to the button FIRST, without cancelling the key: hiding the list while
            // a link has focus drops focus to <body>, and the default Tab would restart from the
            // top of the document.
            buttonEl.value?.el?.focus?.({ preventScroll: true });
            void closeList(false);
            break;
    }
}

function onRootFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (next && rootEl.value?.contains(next)) return;
    void closeList(false);
}

function onLinkClick(event: MouseEvent, link: LinkItem): void {
    emit("navigate", linkId(link), link.href);
    const modified = event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0;
    if (props.navigate && !link.newTab && !modified && !event.defaultPrevented) {
        event.preventDefault();
        props.navigate(link.href);
    }
    void closeList();
}

function onDocumentClick(event: MouseEvent): void {
    if (!open.value) return;
    const t = event.target as Node | null;
    if (t && rootEl.value && !rootEl.value.contains(t)) void closeList(false);
}

onMounted(() => {
    document.addEventListener("click", onDocumentClick);
});

onBeforeUnmount(() => {
    document.removeEventListener("click", onDocumentClick);
});
</script>

<template>
    <div
        ref="rootEl"
        :class="`link-picker ${props.class}`.trim()"
        @focusout="onRootFocusOut"
    >
        <IconButton
            ref="buttonEl"
            baseClass="link-picker-button"
            :label="label"
            :aria-expanded="open ? 'true' : 'false'"
            :aria-controls="listId"
            @click="onButtonClick"
            @keydown="onButtonKeydown"
            @mouseenter="onTooltipButtonEnter"
            @mouseleave="onTooltipButtonLeave"
            @focus="onTooltipButtonFocus"
            @blur="onTooltipButtonBlur"
        >
            <slot v-bind="{ open }">
                <svg
                    class="link-picker-icon"
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
                    <path d="M1 8 8 1.5l7 6.5" />
                    <path d="M2.5 7v7.5h11V7" />
                    <path d="M6.5 14.5v-4h3v4" />
                </svg>
            </slot>
        </IconButton>

        <!-- Purely visual: the same text is already the button's aria-label, so it is not wired
             with aria-describedby (that would announce the name twice). -->
        <div
            class="link-picker-tooltip"
            role="tooltip"
            :id="tooltipId"
            :hidden="tooltipVisible ? undefined : true"
            @mouseenter="hoverTooltip = true"
            @mouseleave="hoverTooltip = false"
        >{{ label }}</div>

        <!-- Named like the sibling pickers' popups: a screen reader entering the list hears what
             it is for. -->
        <ul
            ref="listEl"
            class="link-picker-list"
            :id="listId"
            :aria-label="label"
            :hidden="open ? undefined : true"
            @keydown="onListKeydown"
        >
            <li
                v-for="link in links"
                :key="linkId(link)"
                class="link-picker-list-item"
            >
                <!-- A real link, not role="menuitem": these ARE navigation. -->
                <a
                    class="link-picker-link"
                    :data-link-id="linkId(link)"
                    :href="link.href"
                    :aria-current="link.current ? 'page' : undefined"
                    :target="link.newTab ? '_blank' : undefined"
                    :rel="link.newTab ? 'noopener noreferrer' : undefined"
                    @click="onLinkClick($event, link)"
                >{{ link.label }}</a>
            </li>
        </ul>
    </div>
</template>
