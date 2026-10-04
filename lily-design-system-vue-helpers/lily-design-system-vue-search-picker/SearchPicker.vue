<script lang="ts">
/**
 * The submit button's visible content: U+23CE RETURN SYMBOL, a bare
 * literal character (never an escape — see `bin/test`'s glyph check).
 * It is the button's visible label only; the accessible name comes from
 * the required `submitLabel` prop, so assistive technology never has to
 * announce a symbol.
 */
export const RETURN_SYMBOL = "⏎";

/** Arguments passed to the default scoped slot (the button icon). */
export type SlotArgs = {
    /** Is the search panel open? */
    open: boolean;
    /** The current text in the search field. */
    query: string;
};

/** Alias matching the canonical Svelte helper's type name. */
export type ChildArgs = SlotArgs;

/** Public props for SearchPicker. See `spec/index.md` §4 for the contract. */
export type Props = {
    /** Accessible name for the icon button and the search landmark. */
    label: string;
    /** Accessible name for the search text field. */
    inputLabel: string;
    /** Accessible name for the ⏎ submit button. */
    submitLabel: string;
    /** Placeholder text for the search field. No default. */
    placeholder?: string;
    /** The search text. Bind with `v-model:value`. */
    value?: string;
    /**
     * Path the query is appended to. The search for `foo` navigates to
     * `${action}?foo`; the default `"/"` gives `/?foo`.
     */
    action?: string;
    /**
     * Performs the navigation. Defaults to `location.assign(href)` — a
     * real GET request. Pass a client-side router's navigate function
     * (e.g. `(href) => router.push(href)`) to keep the navigation in-app.
     */
    navigate?: (href: string) => void;
    /** Extra CSS class on the root element. */
    class?: string;
};

/**
 * The destination for a query: `action` + `?` + the URI-encoded,
 * trimmed query. `searchHref("foo")` is `"/?foo"`;
 * `searchHref("foo bar")` is `"/?foo%20bar"`.
 */
export function searchHref(query: string, action = "/"): string {
    return `${action}?${encodeURIComponent(query.trim())}`;
}

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextSearchPickerId(): string {
    uid += 1;
    return `search-picker-${uid}`;
}
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { IconButton } from "@lilydesignsystem/vue-headless";
// Only the trigger button composes a headless primitive. The panel is a
// real <form role="search"> with a real search field and a real submit
// button — a disclosure, not a listbox or a menu — so headless `Listbox`
// is the wrong widget for it, not merely an unmigrated one.

const props = withDefaults(defineProps<Props>(), {
    placeholder: undefined,
    value: "",
    action: "/",
    navigate: undefined,
    class: "",
});

// The Svelte canonical's `onSearch` callback prop is the emitted
// `search` event here (`@search`), the same mapping share-picker uses.
// `navigate` stays a prop: it is not a notification but the action
// itself, and the component needs its default when nobody supplies one.
const emit = defineEmits<{
    (event: "update:value", value: string): void;
    (event: "search", query: string, href: string): void;
}>();

const baseId = nextSearchPickerId();
const panelId = `${baseId}-panel`;

const open = ref(false);

const tooltipId = `${baseId}-tooltip`;

// Tooltip: shown while the pointer is over the button or the tooltip
// itself (hoverable, WCAG 1.4.13) or while the button has keyboard focus;
// Escape dismisses it without moving focus; never shown while the popup is
// open, since the popup then explains the control.
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
    // Keyboard focus only: a mouse click also focuses the button in
    // Chromium, and the tooltip should not stick after a click.
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

// WCAG 1.4.13: while the tooltip is visible, Escape dismisses it wherever
// focus is (hover alone leaves focus elsewhere). The document listener
// exists only while visible; never preventDefault/stopPropagation, no
// focus move. SSR-safe: watch callbacks run client-side only.
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
// Internal source of truth so the field works both controlled
// (`v-model:value`) and uncontrolled (no binding).
const current = ref(props.value ?? "");
// IconButton is a composition: a template ref on it resolves to
// whatever it defineExpose (`{ el }`), not the raw DOM node.
const buttonEl = ref<{ el?: HTMLButtonElement } | null>(null);
const inputEl = ref<HTMLInputElement | null>(null);
const rootEl = ref<HTMLDivElement | null>(null);

watch(
    () => props.value,
    (next) => {
        if (next !== undefined && next !== current.value) current.value = next;
    },
);

function onInput(event: Event): void {
    current.value = (event.target as HTMLInputElement).value;
    emit("update:value", current.value);
}

async function openPanel(): Promise<void> {
    open.value = true;
    // Wait for the DOM flush first — a `hidden` element cannot take focus.
    // preventScroll: the panel is positioned by consumer CSS, and focusing
    // a field rendered partly off-screen would otherwise scroll the page.
    await nextTick();
    inputEl.value?.focus({ preventScroll: true });
}

async function closePanel(refocus = true): Promise<void> {
    if (!open.value) return;
    open.value = false;
    if (refocus) {
        await nextTick();
        buttonEl.value?.el?.focus({ preventScroll: true });
    }
}

function onButtonClick(): void {
    hoverButton.value = false;
    if (open.value) void closePanel();
    else void openPanel();
}

function onPanelKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
        event.preventDefault();
        void closePanel();
    }
}

function onRootFocusOut(event: FocusEvent): void {
    // Close only when focus moves to a known element outside the picker.
    // A focusout with no relatedTarget is not "focus left": Safari does
    // not focus a <button> on click, so pressing ⏎ (or the icon button)
    // blurs the field with relatedTarget = null. Closing there hid the
    // panel before the click landed, so ⏎ never searched and the icon
    // button re-opened instead of closing. Clicks outside the picker are
    // handled by the document click listener below.
    const next = event.relatedTarget as Node | null;
    if (!next || rootEl.value?.contains(next)) return;
    void closePanel(false);
}

function onSubmit(event: Event): void {
    // The form's native GET would send `/?name=value`; the contract is the
    // bare query (`/?foo`), so navigation is done here instead.
    event.preventDefault();
    const query = current.value.trim();
    if (!query) return;
    const href = searchHref(query, props.action);
    emit("search", query, href);
    void closePanel(false);
    if (props.navigate) props.navigate(href);
    else if (typeof location !== "undefined") location.assign(href);
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
</script>

<template>
    <div
        ref="rootEl"
        :class="`search-picker ${props.class}`.trim()"
        @focusout="onRootFocusOut"
    >
        <IconButton
            ref="buttonEl"
            baseClass="search-picker-button"
            :label="label"
            :aria-expanded="open ? 'true' : 'false'"
            :aria-controls="panelId"
            @click="onButtonClick"
            @mouseenter="onTooltipButtonEnter"
            @mouseleave="onTooltipButtonLeave"
            @focus="onTooltipButtonFocus"
            @blur="onTooltipButtonBlur"
            @keydown="onTooltipKeydown"
        >
            <slot v-bind="{ open, query: current }">
                <svg
                    class="search-picker-icon"
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
                    <circle cx="7" cy="7" r="4.5" />
                    <path d="M10.5 10.5 14 14" />
                </svg>
            </slot>
        </IconButton>

        <!-- Purely visual: the same text is already the button's aria-label,
             so it is not wired with aria-describedby (that would announce
             the name twice). -->
        <div
            class="search-picker-tooltip"
            role="tooltip"
            :id="tooltipId"
            :hidden="tooltipVisible ? undefined : true"
            @mouseenter="hoverTooltip = true"
            @mouseleave="hoverTooltip = false"
        >{{ label }}</div>

        <!-- The keydown handler only listens for Escape bubbling up from
             the field and the submit button inside; the panel itself
             takes no focus. -->
        <div
            class="search-picker-panel"
            :id="panelId"
            :hidden="open ? undefined : true"
            @keydown="onPanelKeydown"
        >
            <form
                class="search-picker-form"
                role="search"
                :aria-label="label"
                :action="action"
                method="get"
                @submit="onSubmit"
            >
                <input
                    ref="inputEl"
                    class="search-picker-input"
                    type="search"
                    :aria-label="inputLabel"
                    :placeholder="placeholder"
                    enterkeyhint="search"
                    :value="current"
                    @input="onInput"
                />
                <button type="submit" class="search-picker-submit" :aria-label="submitLabel">
                    <span class="search-picker-submit-symbol" aria-hidden="true">{{ RETURN_SYMBOL }}</span>
                </button>
            </form>
        </div>
    </div>
</template>
