<script lang="ts">
/**
 * Default button icon: a bundled SVG (a stroke-drawn "A"), not a
 * Unicode character. Reversed 2026-09-16 from the font-dependent-glyph
 * convention (was the plain letter U+0041, exported as
 * `LATIN_CAPITAL_LETTER_A` — removed, not renamed). "A" itself needed
 * no escaping and had no font-fallback risk, but it still varied in
 * weight and proportions across font stacks; a bundled outline SVG
 * matches the other four picker icons as one consistent visual family
 * regardless of the consumer's fonts.
 */

/** Arguments passed to the default scoped slot (the button icon). */
export type SlotArgs = {
    /** Currently selected size slug. */
    value: string;
    /** Is the listbox open? */
    open: boolean;
    /** Resolve a slug to its display label. */
    labelFor: (size: string) => string;
};

/** Alias matching the canonical Svelte helper's type name. */
export type ChildArgs = SlotArgs;

/** Public props for TextSizePicker. See `spec/index.md` §4 for the contract. */
export type Props = {
    /** Accessible name for the button and the listbox. */
    label: string;
    /** Available size slugs, e.g. ["small","medium","large","x-large"]. */
    sizes: string[];
    /** Currently selected size slug. Two-way bindable via v-model:value. */
    value?: string;
    /** Initial size when nothing else is supplied. */
    defaultValue?: string;
    /** If set, persist the selection to localStorage under this key. */
    storageKey?: string;
    /** `name` of the hidden input that carries the value in a form. */
    name?: string;
    /** Element that receives `data-text-size`. Defaults to document.documentElement. */
    target?: HTMLElement | null;
    /** Optional pretty labels per slug. */
    sizeLabels?: Record<string, string>;
    /** Extra CSS class on the root element. */
    class?: string;
};

/**
 * Resolve a size slug to its display label: each hyphen-separated word
 * title-cased, so "x-large" renders as "X Large". Mirrors `themeName`
 * in theme-picker and `localeName` in locale-picker.
 */
export function sizeName(size: string): string {
    return size
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextTextSizePickerId(): string {
    uid += 1;
    return `text-size-picker-${uid}`;
}
</script>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = withDefaults(defineProps<Props>(), {
    value: "",
    defaultValue: undefined,
    storageKey: undefined,
    name: "text-size",
    target: undefined,
    sizeLabels: () => ({}),
    class: "",
});

const emit = defineEmits<{
    (event: "update:value", value: string): void;
    (event: "change", value: string): void;
}>();

const baseId = nextTextSizePickerId();
const listId = `${baseId}-list`;
const optionId = (i: number) => `${baseId}-option-${i}`;

const open = ref(false);
const activeIndex = ref(-1);
const buttonEl = ref<HTMLButtonElement | null>(null);
const listEl = ref<HTMLUListElement | null>(null);
const rootEl = ref<HTMLDivElement | null>(null);

// Typeahead buffer: APG listbox behaviour. Reset after a pause.
let typeahead = "";
let typeaheadTimer: ReturnType<typeof setTimeout> | undefined;

function labelFor(size: string): string {
    const overrides = props.sizeLabels ?? {};
    if (size in overrides) return overrides[size];
    return sizeName(size);
}

function applySize(slug: string): void {
    if (typeof document === "undefined" || !slug) return;
    (props.target ?? document.documentElement).setAttribute("data-text-size", slug);
    if (props.storageKey) {
        try {
            localStorage.setItem(props.storageKey, slug);
        } catch {
            // ignore quota / privacy errors
        }
    }
    emit("change", slug);
}

// Internal source of truth so the select works both controlled
// (consumer drives `v-model:value`) and uncontrolled (no binding —
// the select resolves and applies a default itself, per spec §7.6).
const current = ref(props.value ?? "");

function setSize(slug: string): void {
    current.value = slug;
    emit("update:value", slug);
}

// Mirror an externally-controlled `value` into internal state.
watch(
    () => props.value,
    (next) => {
        if (next !== undefined && next !== current.value) current.value = next;
    },
);

// Apply whenever the resolved value changes.
watch(current, (next, prev) => {
    if (next && next !== prev) applySize(next);
});

// ---------------------------------------------------------------
// Open / close
// ---------------------------------------------------------------

async function openList(startIndex?: number): Promise<void> {
    const selected = props.sizes.indexOf(current.value);
    // An empty list has no option to activate; -1 keeps
    // aria-activedescendant off rather than pointing at an id that
    // does not exist.
    activeIndex.value =
        props.sizes.length === 0
            ? -1
            : (startIndex ?? (selected >= 0 ? selected : 0));
    open.value = true;
    // Focus moves to the listbox; the active option is conveyed via
    // aria-activedescendant, per the APG listbox pattern. Wait for the
    // DOM flush first — a `hidden` element cannot take focus.
    await nextTick();
    listEl.value?.focus({ preventScroll: true });
    scrollActiveIntoView();
}

async function closeList(refocus = true): Promise<void> {
    if (!open.value) return;
    open.value = false;
    activeIndex.value = -1;
    if (refocus) {
        await nextTick();
        buttonEl.value?.focus({ preventScroll: true });
    }
}

function choose(index: number): void {
    const slug = props.sizes[index];
    if (slug) setSize(slug);
    void closeList();
}

function scrollActiveIntoView(): void {
    if (activeIndex.value < 0 || !listEl.value) return;
    // Look the option up by id rather than by selector: ids need no CSS
    // escaping this way, and `CSS.escape` is not present in every jsdom.
    const el = document.getElementById(optionId(activeIndex.value));
    // jsdom does not implement scrollIntoView; call it only if present.
    el?.scrollIntoView?.({ block: "nearest" });
}

function moveActive(delta: number): void {
    if (props.sizes.length === 0) return;
    const next = Math.min(
        Math.max(activeIndex.value + delta, 0),
        props.sizes.length - 1,
    );
    activeIndex.value = next;
    scrollActiveIntoView();
}

function runTypeahead(char: string): void {
    const lower = char.toLowerCase();
    // APG listbox typeahead: a single character moves to the NEXT
    // option starting with it, and repeating that character keeps
    // cycling. Only a buffer of differing characters refines the
    // match, and that buffer stays anchored on the active option.
    const sameCharRun =
        typeahead === "" || [...typeahead].every((c) => c === lower);
    typeahead += lower;
    clearTimeout(typeaheadTimer);
    typeaheadTimer = setTimeout(() => (typeahead = ""), 500);
    const query = sameCharRun ? lower : typeahead;
    const anchor = activeIndex.value < 0 ? 0 : activeIndex.value;
    const start = sameCharRun ? anchor + 1 : anchor;
    // Search forward, wrapping once — typeahead wraps even though the
    // arrows clamp, or options above the cursor would be untypable.
    for (let n = 0; n < props.sizes.length; n++) {
        const i = (start + n) % props.sizes.length;
        if (labelFor(props.sizes[i]).toLowerCase().startsWith(query)) {
            activeIndex.value = i;
            scrollActiveIntoView();
            return;
        }
    }
}

function onButtonClick(): void {
    void (open.value ? closeList() : openList());
}

function onButtonKeydown(event: KeyboardEvent): void {
    switch (event.key) {
        case "ArrowDown":
        case "Enter":
        case " ":
            event.preventDefault();
            void openList();
            break;
        case "ArrowUp":
            event.preventDefault();
            void openList(props.sizes.length - 1);
            break;
    }
}

function onListKeydown(event: KeyboardEvent): void {
    switch (event.key) {
        case "ArrowDown":
            event.preventDefault();
            moveActive(1);
            break;
        case "ArrowUp":
            event.preventDefault();
            moveActive(-1);
            break;
        case "Home":
            event.preventDefault();
            activeIndex.value = 0;
            scrollActiveIntoView();
            break;
        case "End":
            event.preventDefault();
            activeIndex.value = props.sizes.length - 1;
            scrollActiveIntoView();
            break;
        case "Enter":
        case " ":
            event.preventDefault();
            if (activeIndex.value >= 0) choose(activeIndex.value);
            break;
        case "Escape":
            event.preventDefault();
            void closeList();
            break;
        case "PageUp":
            event.preventDefault();
            moveActive(-10);
            break;
        case "PageDown":
            // ±10, clamped: an APG-optional key, matching the
            // sibling pickers.
            event.preventDefault();
            moveActive(10);
            break;
        case "Tab":
            // Tab moves on — but focus goes to the button FIRST,
            // without cancelling the key. Hiding the focused list
            // drops focus to <body>, and the browser then computes
            // the default Tab move from the top of the document, so
            // tabbing out of an open picker teleported the user to
            // the page's first tab stop. From the button, the default
            // Tab lands exactly where leaving the picker should.
            buttonEl.value?.focus?.({ preventScroll: true });
            void closeList(false);
            break;
        default:
            if (
                event.key.length === 1 &&
                !event.ctrlKey &&
                !event.metaKey &&
                !event.altKey
            ) {
                runTypeahead(event.key);
            }
    }
}

function onRootFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (next && rootEl.value?.contains(next)) return;
    void closeList(false);
}

function onDocumentClick(event: MouseEvent): void {
    if (!open.value) return;
    const t = event.target as Node | null;
    if (t && rootEl.value && !rootEl.value.contains(t)) void closeList(false);
}

// ---------------------------------------------------------------
// Initial value resolution + apply (unchanged from the select era)
// ---------------------------------------------------------------

onMounted(() => {
    document.addEventListener("click", onDocumentClick);

    let initial = current.value;
    if (!initial && props.storageKey) {
        try {
            initial = localStorage.getItem(props.storageKey) ?? "";
        } catch {
            // ignore privacy errors
        }
    }
    if (!initial) {
        initial =
            props.defaultValue ??
            (props.sizes.includes("medium") ? "medium" : props.sizes[0]) ??
            "";
    }
    if (initial && initial !== current.value) {
        current.value = initial;
        emit("update:value", initial);
        return;
    }
    if (initial) applySize(initial);
});

onBeforeUnmount(() => {
    document.removeEventListener("click", onDocumentClick);
    clearTimeout(typeaheadTimer);
});
</script>

<template>
    <div
        ref="rootEl"
        :class="`text-size-picker ${props.class}`.trim()"
        @focusout="onRootFocusOut"
    >
        <input type="hidden" :name="name" :value="current" />

        <button
            ref="buttonEl"
            type="button"
            class="text-size-picker-button"
            :aria-label="label"
            aria-haspopup="listbox"
            :aria-expanded="open ? 'true' : 'false'"
            :aria-controls="listId"
            @click="onButtonClick"
            @keydown="onButtonKeydown"
        >
            <slot v-bind="{ value: current, open, labelFor }">
                <svg
                    class="text-size-picker-icon"
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
                    <path d="M4 13 7.2 3h1.6L12 13M5.4 9.5h5.2" />
                </svg>
            </slot>
        </button>

        <ul
            ref="listEl"
            class="text-size-picker-list"
            :id="listId"
            role="listbox"
            :aria-label="label"
            :aria-activedescendant="
                open && activeIndex >= 0 ? optionId(activeIndex) : undefined
            "
            tabindex="-1"
            :hidden="open ? undefined : true"
            @keydown="onListKeydown"
        >
            <li
                v-for="(size, i) in sizes"
                :key="size"
                class="text-size-picker-option"
                :id="optionId(i)"
                role="option"
                :aria-selected="size === current ? 'true' : 'false'"
                :data-active="i === activeIndex ? '' : undefined"
                @click="choose(i)"
            >{{ labelFor(size) }}</li>
        </ul>
    </div>
</template>
