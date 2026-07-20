<script lang="ts">
import {
    defaultLocaleLabels,
    RTL_LANGUAGE_TAGS,
    RTL_SCRIPT_SUBTAGS,
} from "./locales.js";

/**
 * Default button glyph: U+1F310 GLOBE WITH MERIDIANS followed by
 * U+FE0E VARIATION SELECTOR-15.
 *
 * VS15 requests *text* presentation. Without it the browser picks the
 * colour-emoji font and the globe renders blue, which does not match
 * theme-select's monochrome ◑ — the two controls sit next to each
 * other in a page header and should read as one set.
 */
export const GLOBE_WITH_MERIDIANS = "\u{1F310}\uFE0E";

/** Arguments passed to the default scoped slot (the button glyph). */
export type SlotArgs = {
    /** Currently selected locale code (consumer form, not BCP 47-normalised). */
    value: string;
    /** Is the listbox open? */
    open: boolean;
    /** Resolve a locale code to its display label. */
    labelFor: (locale: string) => string;
};

/** Alias matching the canonical Svelte helper's type name. */
export type ChildArgs = SlotArgs;

/** Public props for LocaleSelect. See `spec/index.md` §4 for the contract. */
export type Props = {
    /** Accessible name for the button and the listbox. */
    label: string;
    /** Available locale codes. */
    locales: string[];
    /** Currently selected locale code. Two-way bindable via v-model:value. */
    value?: string;
    /** Initial locale when nothing else is supplied. */
    defaultValue?: string;
    /** If set, persist the selection to localStorage under this key. */
    storageKey?: string;
    /** Resolve `navigator.languages` to a supported locale on first visit. */
    detectFromNavigator?: boolean;
    /** `name` of the hidden input that carries the value in a form. */
    name?: string;
    /** Element that receives `lang` and `dir`. Defaults to document.documentElement. */
    target?: HTMLElement | null;
    /** If false, the select only writes `lang` and never touches `dir`. */
    applyDir?: boolean;
    /** Optional pretty labels per locale code. */
    localeLabels?: Record<string, string>;
    /** Extra CSS class on the root element. */
    class?: string;
};

// ---------------------------------------------------------------
// Pure helpers (exported so consumers can reuse them)
// ---------------------------------------------------------------

/** Convert a locale code to its BCP 47 hyphen form. */
export function bcp47LocaleTag(locale: string): string {
    return locale.replace(/_/g, "-");
}

/** Detect whether a locale is right-to-left. See spec/index.md §5.6. */
export function isRtlLocale(locale: string): boolean {
    if (!locale) return false;
    const parts = locale.split(/[-_]/);
    for (const part of parts) {
        if (RTL_SCRIPT_SUBTAGS.has(part.toLowerCase())) return true;
    }
    const base = parts[0]?.toLowerCase() ?? "";
    return RTL_LANGUAGE_TAGS.has(base);
}

/** Resolve a locale code to its English name via the built-in table. */
export function localeName(locale: string): string {
    return defaultLocaleLabels[locale] ?? locale;
}

/** Re-export the built-in label table and RTL sets for convenience. */
export { defaultLocaleLabels, RTL_LANGUAGE_TAGS, RTL_SCRIPT_SUBTAGS };

/** Opportunistic Intl.DisplayNames lookup; never throws. */
function intlDisplayName(locale: string): string {
    try {
        const env =
            typeof navigator !== "undefined" && navigator.language
                ? navigator.language
                : "en";
        const dn = new Intl.DisplayNames([env], { type: "language" });
        return dn.of(bcp47LocaleTag(locale)) ?? "";
    } catch {
        return "";
    }
}

/** Match a navigator preference against a supported-locales list. */
export function matchNavigatorLanguage(
    navLangs: readonly string[],
    locales: readonly string[],
): string | "" {
    const lc = (s: string) => s.toLowerCase().replace(/_/g, "-");
    const localesLc = locales.map(lc);
    for (const raw of navLangs) {
        const nav = lc(raw);
        const exactIndex = localesLc.indexOf(nav);
        if (exactIndex !== -1) return locales[exactIndex];
        const navBase = nav.split("-")[0];
        for (let i = 0; i < locales.length; i++) {
            const base = localesLc[i].split("-")[0];
            if (base === navBase) return locales[i];
        }
    }
    return "";
}

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextLocaleSelectId(): string {
    uid += 1;
    return `locale-select-${uid}`;
}
</script>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = withDefaults(defineProps<Props>(), {
    value: "",
    defaultValue: undefined,
    storageKey: undefined,
    detectFromNavigator: false,
    name: "locale",
    target: undefined,
    applyDir: true,
    localeLabels: () => ({}),
    class: "",
});

const emit = defineEmits<{
    (event: "update:value", value: string): void;
    (event: "change", value: string): void;
}>();

const baseId = nextLocaleSelectId();
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

function labelFor(locale: string): string {
    const overrides = props.localeLabels ?? {};
    if (locale in overrides) return overrides[locale];
    if (locale in defaultLocaleLabels) return defaultLocaleLabels[locale];
    const intl = intlDisplayName(locale);
    if (intl) return intl;
    return locale;
}

function tagFor(locale: string): string {
    return bcp47LocaleTag(locale);
}

function applyLocale(code: string): void {
    if (typeof document === "undefined" || !code) return;
    const root = props.target ?? document.documentElement;
    root.setAttribute("lang", bcp47LocaleTag(code));
    if (props.applyDir) {
        root.setAttribute("dir", isRtlLocale(code) ? "rtl" : "ltr");
    }
    if (props.storageKey) {
        try {
            localStorage.setItem(props.storageKey, code);
        } catch {
            // ignore quota / privacy errors
        }
    }
    emit("change", code);
}

// Internal source of truth so the select works both controlled
// (consumer drives `v-model:value`) and uncontrolled (no binding —
// the select resolves and applies a default itself, per spec §7.4).
const current = ref(props.value ?? "");

function setLocale(code: string): void {
    current.value = code;
    emit("update:value", code);
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
    if (next && next !== prev) applyLocale(next);
});

// ---------------------------------------------------------------
// Open / close
// ---------------------------------------------------------------

async function openList(startIndex?: number): Promise<void> {
    const selected = props.locales.indexOf(current.value);
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
    const code = props.locales[index];
    if (code) setLocale(code);
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
    if (props.locales.length === 0) return;
    const next = Math.min(
        Math.max(activeIndex.value + delta, 0),
        props.locales.length - 1,
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
    for (let n = 0; n < props.locales.length; n++) {
        const i = (from + n) % props.locales.length;
        if (labelFor(props.locales[i]).toLowerCase().startsWith(typeahead)) {
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
            void openList(props.locales.length - 1);
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
            activeIndex.value = props.locales.length - 1;
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

    if (!initial && props.detectFromNavigator && typeof navigator !== "undefined") {
        const navLangs =
            navigator.languages && navigator.languages.length > 0
                ? Array.from(navigator.languages)
                : navigator.language
                  ? [navigator.language]
                  : [];
        initial = matchNavigatorLanguage(navLangs, props.locales);
    }

    if (!initial) {
        initial =
            props.defaultValue ??
            (props.locales.includes("en") ? "en" : props.locales[0]) ??
            "";
    }

    if (initial && initial !== current.value) {
        current.value = initial;
        emit("update:value", initial);
        return;
    }
    if (initial) applyLocale(initial);
});

onBeforeUnmount(() => {
    document.removeEventListener("click", onDocumentClick);
    clearTimeout(typeaheadTimer);
});
</script>

<template>
    <div
        ref="rootEl"
        :class="`locale-select ${props.class}`.trim()"
        @focusout="onRootFocusOut"
    >
        <input type="hidden" :name="name" :value="current" />

        <button
            ref="buttonEl"
            type="button"
            class="locale-select-button"
            :aria-label="label"
            aria-haspopup="listbox"
            :aria-expanded="open ? 'true' : 'false'"
            :aria-controls="listId"
            @click="onButtonClick"
            @keydown="onButtonKeydown"
        >
            <slot v-bind="{ value: current, open, labelFor }">
                <span class="locale-select-icon" aria-hidden="true">{{
                    GLOBE_WITH_MERIDIANS
                }}</span>
            </slot>
        </button>

        <ul
            ref="listEl"
            class="locale-select-list"
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
                v-for="(locale, i) in locales"
                :key="locale"
                class="locale-select-option"
                :id="optionId(i)"
                role="option"
                :aria-selected="locale === current ? 'true' : 'false'"
                :data-active="i === activeIndex ? '' : undefined"
                :lang="tagFor(locale)"
                @click="choose(i)"
            >{{ labelFor(locale) }}</li>
        </ul>
    </div>
</template>
