<script lang="ts">
/**
 * Default button icon: a bundled SVG (contrast/half-circle), not a
 * Unicode character. Reversed 2026-09-16 from the font-dependent-glyph
 * convention (was U+25D1 CIRCLE WITH RIGHT HALF BLACK, exported as
 * `CIRCLE_WITH_RIGHT_HALF_BLACK` — removed, not renamed, since there is
 * no longer a single swappable character value). A bundled outline SVG
 * renders identically across every font stack and platform. `viewBox="0
 * 0 16 16"`, stroke-based (`stroke-width="1.6"`, round caps/joins) to
 * match the other four picker icons as one visual family. Override via
 * the default scoped slot, same as before.
 */

/** Arguments passed to the default scoped slot (the button icon). */
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

/** Public props for ThemePicker. See `spec/index.md` §4 for the contract. */
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
 * Patients". Mirrors `localeName` in locale-picker.
 */
export function themeName(theme: string): string {
    return theme
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

/**
 * Resolve the OS colour-scheme preference to a supported theme slug.
 * Mirrors `matchNavigatorLanguage` in locale-picker. Returns "" when
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
export function nextThemePickerId(): string {
    uid += 1;
    return `theme-picker-${uid}`;
}
</script>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { IconButton, Listbox } from "@lilydesignsystem/vue-headless";

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

const baseId = nextThemePickerId();
const listId = `${baseId}-list`;
const optionId = (i: number) => `${baseId}-option-${i}`;

const open = ref(false);
const activeIndex = ref(-1);
// IconButton/Listbox are compositions: a template ref on them resolves
// to whatever they defineExpose (`{ el }`), not the raw DOM node.
const buttonEl = ref<{ el?: HTMLButtonElement } | null>(null);
const listEl = ref<{ el?: HTMLElement } | null>(null);
const rootEl = ref<HTMLDivElement | null>(null);

function labelFor(theme: string): string {
    const labels = props.themeLabels ?? {};
    if (theme in labels) return labels[theme];
    return themeName(theme);
}

function getManagedLink(): HTMLLinkElement {
    const selector = `link[data-lily-theme-picker="${props.name}"]`;
    let link = document.head.querySelector<HTMLLinkElement>(selector);
    if (!link) {
        link = document.createElement("link");
        link.rel = "stylesheet";
        link.setAttribute("data-lily-theme-picker", props.name);
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
    // An empty list has no option to activate; -1 keeps
    // aria-activedescendant off rather than pointing at an id that
    // does not exist.
    activeIndex.value =
        props.themes.length === 0
            ? -1
            : (startIndex ?? (selected >= 0 ? selected : 0));
    open.value = true;
    // Focus moves to the listbox; the active option is conveyed via
    // aria-activedescendant, per the APG listbox pattern. Wait for the
    // DOM flush first — a `hidden` element cannot take focus.
    await nextTick();
    listEl.value?.el?.focus({ preventScroll: true });
}

async function closeList(refocus = true): Promise<void> {
    if (!open.value) return;
    open.value = false;
    activeIndex.value = -1;
    if (refocus) {
        await nextTick();
        buttonEl.value?.el?.focus({ preventScroll: true });
    }
}

function choose(index: number): void {
    const slug = props.themes[index];
    if (slug) setTheme(slug);
    void closeList();
}

function scrollActiveIntoView(): void {
    if (activeIndex.value < 0 || !listEl.value?.el) return;
    // Look the option up by id rather than by selector: ids need no CSS
    // escaping this way, and `CSS.escape` is not present in every jsdom.
    const el = document.getElementById(optionId(activeIndex.value));
    // jsdom does not implement scrollIntoView; call it only if present.
    el?.scrollIntoView?.({ block: "nearest" });
}

// Arrow/Home/End/PageUp/PageDown/typeahead/Escape/Tab keyboard handling
// inside the open list is owned by Listbox's "active-descendant" mode
// (see @lilydesignsystem/vue-headless); this component only decides
// what open/close/choose/scroll mean. Keep the highlighted option in
// view for every reason activeIndex can change.
watch(activeIndex, () => scrollActiveIntoView());

function handleTabOut(): void {
    // Tab moves on — but focus goes to the button FIRST, without
    // cancelling the key (Listbox's tab-out emit never preventDefaults
    // Tab). Hiding the focused list drops focus to <body>, and the
    // browser then computes the default Tab move from the top of the
    // document, so tabbing out of an open picker teleported the user to
    // the page's first tab stop. From the button, the default Tab lands
    // exactly where leaving the picker should.
    buttonEl.value?.el?.focus?.({ preventScroll: true });
    void closeList(false);
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
});
</script>

<template>
    <div
        ref="rootEl"
        :class="`theme-picker ${props.class}`.trim()"
        @focusout="onRootFocusOut"
    >
        <input type="hidden" :name="name" :value="current" />

        <IconButton
            ref="buttonEl"
            baseClass="theme-picker-button"
            :label="label"
            aria-haspopup="listbox"
            :aria-expanded="open ? 'true' : 'false'"
            :aria-controls="listId"
            @click="onButtonClick"
            @keydown="onButtonKeydown"
        >
            <slot v-bind="{ value: current, open, labelFor }">
                <svg
                    class="theme-picker-icon"
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
                    <circle cx="8" cy="8" r="6" />
                    <path d="M8 2a6 6 0 0 1 0 12z" fill="currentColor" stroke="none" />
                </svg>
            </slot>
        </IconButton>

        <Listbox
            ref="listEl"
            as="ul"
            baseClass="theme-picker-list"
            :id="listId"
            :label="label"
            navigation="active-descendant"
            clamp
            typeahead
            :pageSize="10"
            v-model:activeIndex="activeIndex"
            :hidden="open ? undefined : true"
            @activate="choose"
            @escape="() => closeList()"
            @tab-out="handleTabOut"
        >
            <li
                v-for="(theme, i) in themes"
                :key="theme"
                class="theme-picker-option"
                :id="optionId(i)"
                role="option"
                :aria-selected="theme === current ? 'true' : 'false'"
                :data-active="i === activeIndex ? '' : undefined"
                @click="choose(i)"
            >{{ labelFor(theme) }}</li>
        </Listbox>
    </div>
</template>
