<script lang="ts">
/**
 * Default button glyph: U+23F8 PAUSE SIGN, paired with U+FE0E
 * (VARIATION SELECTOR-15) to force text presentation — the same
 * treatment locale-picker gives its globe.
 *
 * A pause glyph reads as "stop the moving parts" more directly than an
 * abstract symbol, has a real monochrome glyph in ordinary system
 * fonts (media-transport symbols default to text presentation, unlike
 * most pictographs), and doesn't collide with any sibling picker's
 * glyph (theme's CIRCLE WITH RIGHT HALF BLACK, locale's GLOBE WITH
 * MERIDIANS, text-size's plain "A", share's BLACK RIGHTWARDS
 * ARROWHEAD, date-time's CALENDAR).
 */
export const PAUSE_SIGN = "⏸︎";

/** Arguments passed to the default scoped slot (the button glyph). */
export type SlotArgs = {
    /** Currently selected motion slug. */
    value: string;
    /** Is the listbox open? */
    open: boolean;
    /** Resolve a slug to its display label. */
    labelFor: (motion: string) => string;
};

/** Alias matching the canonical Svelte helper's type name. */
export type ChildArgs = SlotArgs;

/** Public props for MotionPicker. See `spec/index.md` §4 for the contract. */
export type Props = {
    /** Accessible name for the button and the listbox. */
    label: string;
    /** Available motion slugs, e.g. ["no-preference","reduce"]. */
    motions: string[];
    /** Currently selected motion slug. Two-way bindable via v-model:value. */
    value?: string;
    /** Initial motion when nothing else is supplied. */
    defaultValue?: string;
    /** If set, persist the selection to localStorage under this key. */
    storageKey?: string;
    /** `name` of the hidden input that carries the value in a form. */
    name?: string;
    /** Element that receives `data-motion`. Defaults to document.documentElement. */
    target?: HTMLElement | null;
    /** Optional pretty labels per slug. */
    motionLabels?: Record<string, string>;
    /** Extra CSS class on the root element. */
    class?: string;
};

/**
 * Resolve a motion slug to its display label: each hyphen-separated
 * word title-cased, so "no-preference" renders as "No Preference".
 * Mirrors `sizeName` in text-size-picker and `themeName` in
 * theme-picker.
 */
export function motionName(motion: string): string {
    return motion
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

/**
 * True when the platform reports a preference for reduced motion.
 * SSR-safe: `window`/`matchMedia` are absent on the server, so this
 * resolves to `false` there and the client re-derives it on mount.
 */
export function prefersReducedMotion(): boolean {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return false;
    }
    try {
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
        return false;
    }
}

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextMotionPickerId(): string {
    uid += 1;
    return `motion-picker-${uid}`;
}
</script>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = withDefaults(defineProps<Props>(), {
    value: "",
    defaultValue: undefined,
    storageKey: undefined,
    name: "motion",
    target: undefined,
    motionLabels: () => ({}),
    class: "",
});

const emit = defineEmits<{
    (event: "update:value", value: string): void;
    (event: "change", value: string): void;
}>();

const baseId = nextMotionPickerId();
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

function labelFor(motion: string): string {
    const overrides = props.motionLabels ?? {};
    if (motion in overrides) return overrides[motion];
    return motionName(motion);
}

function applyMotion(slug: string): void {
    if (typeof document === "undefined" || !slug) return;
    (props.target ?? document.documentElement).setAttribute("data-motion", slug);
    if (props.storageKey) {
        try {
            localStorage.setItem(props.storageKey, slug);
        } catch {
            // ignore quota / privacy errors
        }
    }
    emit("change", slug);
}

// Internal source of truth so the picker works both controlled
// (consumer drives `v-model:value`) and uncontrolled (no binding —
// the picker resolves and applies a default itself, per spec §7.6).
const current = ref(props.value ?? "");

function setMotion(slug: string): void {
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

// Apply whenever the resolved value changes. Vue's reactivity system
// does not fire a watcher when the new value strictly equals the old
// one, so this is already idempotent — no separate applied-value guard
// needed (contrast the Svelte/React ports, whose effect can re-run for
// reasons other than a value change and so guard explicitly).
watch(current, (next, prev) => {
    if (next && next !== prev) applyMotion(next);
});

// ---------------------------------------------------------------
// Open / close
// ---------------------------------------------------------------

async function openList(startIndex?: number): Promise<void> {
    const selected = props.motions.indexOf(current.value);
    // An empty list has no option to activate; -1 keeps
    // aria-activedescendant off rather than pointing at an id that
    // does not exist.
    activeIndex.value =
        props.motions.length === 0
            ? -1
            : (startIndex ?? (selected >= 0 ? selected : 0));
    open.value = true;
    // Focus moves to the listbox; the active option is conveyed via
    // aria-activedescendant, per the APG listbox pattern. Wait for the
    // DOM flush first — a `hidden` element cannot take focus.
    await nextTick();
    listEl.value?.focus();
    scrollActiveIntoView();
}

async function closeList(refocus = true): Promise<void> {
    if (!open.value) return;
    open.value = false;
    activeIndex.value = -1;
    if (refocus) {
        await nextTick();
        buttonEl.value?.focus();
    }
}

function choose(index: number): void {
    const slug = props.motions[index];
    if (slug) setMotion(slug);
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
    if (props.motions.length === 0) return;
    const next = Math.min(
        Math.max(activeIndex.value + delta, 0),
        props.motions.length - 1,
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
    for (let n = 0; n < props.motions.length; n++) {
        const i = (start + n) % props.motions.length;
        if (labelFor(props.motions[i]).toLowerCase().startsWith(query)) {
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
            void openList(props.motions.length - 1);
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
            activeIndex.value = props.motions.length - 1;
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
            buttonEl.value?.focus?.();
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
// Initial value resolution + apply
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
        // Unlike text-size-picker's "medium" default, motion has a
        // real external signal to defer to: the platform's own
        // (prefers-reduced-motion: reduce) media query.
        const osPreferred = prefersReducedMotion() ? "reduce" : "no-preference";
        initial =
            props.defaultValue ??
            (props.motions.includes(osPreferred) ? osPreferred : undefined) ??
            props.motions[0] ??
            "";
    }
    if (initial && initial !== current.value) {
        current.value = initial;
        emit("update:value", initial);
        return;
    }
    if (initial) applyMotion(initial);
});

onBeforeUnmount(() => {
    document.removeEventListener("click", onDocumentClick);
    clearTimeout(typeaheadTimer);
});
</script>

<template>
    <div
        ref="rootEl"
        :class="`motion-picker ${props.class}`.trim()"
        @focusout="onRootFocusOut"
    >
        <input type="hidden" :name="name" :value="current" />

        <button
            ref="buttonEl"
            type="button"
            class="motion-picker-button"
            :aria-label="label"
            aria-haspopup="listbox"
            :aria-expanded="open ? 'true' : 'false'"
            :aria-controls="listId"
            @click="onButtonClick"
            @keydown="onButtonKeydown"
        >
            <slot v-bind="{ value: current, open, labelFor }">
                <span class="motion-picker-icon" aria-hidden="true">{{
                    PAUSE_SIGN
                }}</span>
            </slot>
        </button>

        <ul
            ref="listEl"
            class="motion-picker-list"
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
                v-for="(motion, i) in motions"
                :key="motion"
                class="motion-picker-option"
                :id="optionId(i)"
                role="option"
                :aria-selected="motion === current ? 'true' : 'false'"
                :data-active="i === activeIndex ? '' : undefined"
                @click="choose(i)"
            >{{ labelFor(motion) }}</li>
        </ul>
    </div>
</template>
