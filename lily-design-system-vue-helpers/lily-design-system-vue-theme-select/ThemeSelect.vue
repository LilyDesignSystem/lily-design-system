<script lang="ts">
/** Default button glyph: U+25D1 CIRCLE WITH RIGHT HALF BLACK. */
export const CIRCLE_WITH_RIGHT_HALF_BLACK = "◑";

/** Arguments passed to the default scoped slot (the button glyph). */
export type SlotArgs = {
    /** Currently selected theme slug. */
    value: string;
    /** Is the listbox open? */
    open: boolean;
    /** Resolve a slug to its display label. */
    labelFor: (theme: string) => string;
};

/** Alias matching the canonical Svelte helper's type name. */
export type ChildArgs = SlotArgs;

/** Public props for ThemeSelect. See `spec/index.md` §4 for the contract. */
export type Props = {
    /** Accessible name for the button and the listbox. */
    label: string;
    /** Base URL of the themes directory, e.g. "/assets/themes/". */
    themesUrl: string;
    /** Available theme slugs. */
    themes: string[];
    /** Currently selected theme slug. Two-way bindable via v-model:value. */
    value?: string;
    /** Initial theme when nothing else is supplied. */
    defaultValue?: string;
    /** If set, persist the selection to localStorage under this key. */
    storageKey?: string;
    /** Resolve `prefers-color-scheme` to a supported theme on first visit. */
    detectFromSystem?: boolean;
    /** Discriminates the managed <link>; also the hidden input's `name`. */
    name?: string;
    /** File extension appended to each slug when constructing the URL. */
    extension?: string;
    /** Element that receives `data-theme`. Defaults to document.documentElement. */
    target?: HTMLElement | null;
    /** Optional pretty labels per slug. */
    themeLabels?: Record<string, string>;
    /** Extra CSS class on the root element. */
    class?: string;
};

/**
 * Resolve a theme slug to its display label: each hyphen-separated
 * word title-cased, so a slug like
 * "united-kingdom-national-health-service-england-for-patients"
 * renders as "United Kingdom National Health Service England For
 * Patients". Mirrors `localeName` in locale-select.
 */
export function themeName(theme: string): string {
    return theme
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

/**
 * Resolve the OS colour-scheme preference to a supported theme slug.
 * Mirrors `matchNavigatorLanguage` in locale-select. Returns "" when
 * the preferred scheme is not in `themes`, or when matchMedia is
 * unavailable (SSR — jsdom does not implement it either).
 */
export function matchSystemTheme(themes: readonly string[]): string {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
        return "";
    }
    const wanted = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    return themes.includes(wanted) ? wanted : "";
}

/** Normalise the themes directory URL to end with exactly one "/". */
export function normaliseThemesUrl(themesUrl: string): string {
    return themesUrl.endsWith("/") ? themesUrl : themesUrl + "/";
}

/** Construct the href for a given theme slug. */
export function themeHref(themesUrl: string, slug: string, extension: string): string {
    return normaliseThemesUrl(themesUrl) + slug + extension;
}

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextThemeSelectId(): string {
    uid += 1;
    return `theme-select-${uid}`;
}
</script>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = withDefaults(defineProps<Props>(), {
    value: "",
    defaultValue: undefined,
    storageKey: undefined,
    detectFromSystem: false,
    name: "theme",
    extension: ".css",
    target: undefined,
    themeLabels: () => ({}),
    class: "",
});

const emit = defineEmits<{
    (event: "update:value", value: string): void;
    (event: "change", value: string): void;
}>();

const baseId = nextThemeSelectId();
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

function labelFor(theme: string): string {
    const labels = props.themeLabels ?? {};
    if (theme in labels) return labels[theme];
    return themeName(theme);
}

function getManagedLink(): HTMLLinkElement {
    const selector = `link[data-lily-theme-select="${props.name}"]`;
    let link = document.head.querySelector<HTMLLinkElement>(selector);
    if (!link) {
        link = document.createElement("link");
        link.rel = "stylesheet";
        link.setAttribute("data-lily-theme-select", props.name);
        document.head.appendChild(link);
    }
    return link;
}

function applyTheme(slug: string): void {
    if (typeof document === "undefined" || !slug) return;
    getManagedLink().href = themeHref(props.themesUrl, slug, props.extension);
    (props.target ?? document.documentElement).setAttribute("data-theme", slug);
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

function setTheme(slug: string): void {
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
    if (next && next !== prev) applyTheme(next);
});

// ---------------------------------------------------------------
// Open / close
// ---------------------------------------------------------------

async function openList(startIndex?: number): Promise<void> {
    const selected = props.themes.indexOf(current.value);
    activeIndex.value = startIndex ?? (selected >= 0 ? selected : 0);
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
    const slug = props.themes[index];
    if (slug) setTheme(slug);
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
    if (props.themes.length === 0) return;
    const next = Math.min(
        Math.max(activeIndex.value + delta, 0),
        props.themes.length - 1,
    );
    activeIndex.value = next;
    scrollActiveIntoView();
}

function runTypeahead(char: string): void {
    typeahead += char.toLowerCase();
    clearTimeout(typeaheadTimer);
    typeaheadTimer = setTimeout(() => (typeahead = ""), 500);
    const from = activeIndex.value < 0 ? 0 : activeIndex.value;
    // Search forward from the active option, wrapping once.
    for (let n = 0; n < props.themes.length; n++) {
        const i = (from + n) % props.themes.length;
        if (labelFor(props.themes[i]).toLowerCase().startsWith(typeahead)) {
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
            void openList(props.themes.length - 1);
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
            activeIndex.value = props.themes.length - 1;
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
        case "Tab":
            // Tab moves on: close without stealing focus back.
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
    if (!initial && props.detectFromSystem) {
        initial = matchSystemTheme(props.themes);
    }
    if (!initial) {
        initial =
            props.defaultValue ??
            (props.themes.includes("light") ? "light" : props.themes[0]) ??
            "";
    }
    if (initial && initial !== current.value) {
        current.value = initial;
        emit("update:value", initial);
        return;
    }
    if (initial) applyTheme(initial);
});

onBeforeUnmount(() => {
    document.removeEventListener("click", onDocumentClick);
    clearTimeout(typeaheadTimer);
});
</script>

<template>
    <div
        ref="rootEl"
        :class="`theme-select ${props.class}`.trim()"
        @focusout="onRootFocusOut"
    >
        <input type="hidden" :name="name" :value="current" />

        <button
            ref="buttonEl"
            type="button"
            class="theme-select-button"
            :aria-label="label"
            aria-haspopup="listbox"
            :aria-expanded="open ? 'true' : 'false'"
            :aria-controls="listId"
            @click="onButtonClick"
            @keydown="onButtonKeydown"
        >
            <slot v-bind="{ value: current, open, labelFor }">
                <span class="theme-select-icon" aria-hidden="true">{{
                    CIRCLE_WITH_RIGHT_HALF_BLACK
                }}</span>
            </slot>
        </button>

        <ul
            ref="listEl"
            class="theme-select-list"
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
                v-for="(theme, i) in themes"
                :key="theme"
                class="theme-select-option"
                :id="optionId(i)"
                role="option"
                :aria-selected="theme === current ? 'true' : 'false'"
                :data-active="i === activeIndex ? '' : undefined"
                @click="choose(i)"
            >{{ labelFor(theme) }}</li>
        </ul>
    </div>
</template>
