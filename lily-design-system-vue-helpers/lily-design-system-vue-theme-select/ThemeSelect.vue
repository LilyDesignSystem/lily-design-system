<script lang="ts">
/** Arguments passed to the default scoped slot. */
export type SlotArgs = {
    /** The theme slugs to render as `<option>` elements. */
    themes: string[];
    /** Currently selected theme slug. */
    value: string;
    /** Apply a theme imperatively (also updates `v-model:value`). */
    setTheme: (theme: string) => void;
    /** `name` attribute of the `<select>`. */
    name: string;
    /** Resolve a slug to its display label. */
    labelFor: (theme: string) => string;
};

/** Public props for ThemeSelect. See `spec/index.md` §4 for the contract. */
export type Props = {
    /** Accessible label for the `<select>`. */
    label: string;
    /**
     * Text of the always-displayed placeholder option. The closed
     * `<select>` shows this instead of the selected theme name, so the
     * control stays as narrow as this word. Defaults to `label`.
     */
    placeholder?: string;
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
    /** `name` attribute of the `<select>`. */
    name?: string;
    /** File extension appended to each slug when constructing the URL. */
    extension?: string;
    /** Element that receives `data-theme`. Defaults to document.documentElement. */
    target?: HTMLElement | null;
    /** Optional pretty labels per slug. */
    themeLabels?: Record<string, string>;
    /** Extra CSS class on the `<select>` root. */
    class?: string;
};

/** Normalise the themes directory URL to end with exactly one "/". */
export function normaliseThemesUrl(themesUrl: string): string {
    return themesUrl.endsWith("/") ? themesUrl : themesUrl + "/";
}

/** Construct the href for a given theme slug. */
export function themeHref(themesUrl: string, slug: string, extension: string): string {
    return normaliseThemesUrl(themesUrl) + slug + extension;
}
</script>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

const props = withDefaults(defineProps<Props>(), {
    placeholder: undefined,
    value: "",
    defaultValue: undefined,
    storageKey: undefined,
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

function labelFor(theme: string): string {
    const labels = props.themeLabels ?? {};
    if (theme in labels) return labels[theme];
    return theme.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
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

onMounted(() => {
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

/**
 * The `<select>` is never bound to `current`: its own selection snaps back
 * to the placeholder option after every change, so the closed control
 * always reads `placeholder ?? label` rather than the active theme name.
 * The real selection lives in `current` / `v-model:value`.
 */
function onSelectChange(e: Event) {
    const el = e.target as HTMLSelectElement;
    const chosen = el.value;
    el.value = "";
    if (chosen) setTheme(chosen);
}
</script>

<template>
    <select
        :class="`theme-select ${props.class}`.trim()"
        :aria-label="label"
        :name="name"
        @change="onSelectChange"
    >
        <option
            class="theme-select-option theme-select-placeholder"
            value=""
            selected
        >{{ placeholder ?? label }}</option>
        <slot
            v-bind="{ themes, value: current, setTheme, name, labelFor }"
        >
            <option
                v-for="theme in themes"
                :key="theme"
                class="theme-select-option"
                :value="theme"
            >{{ labelFor(theme) }}</option>
        </slot>
    </select>
</template>
