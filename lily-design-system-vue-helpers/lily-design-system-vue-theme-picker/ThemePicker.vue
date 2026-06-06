<script lang="ts">
/** Arguments passed to the default scoped slot. */
export type SlotArgs = {
    /** The theme slugs to render as options. */
    themes: string[];
    /** Currently selected theme slug. */
    value: string;
    /** Apply a theme imperatively (also updates `v-model:value`). */
    setTheme: (theme: string) => void;
    /** Shared `name` attribute for the radio inputs. */
    name: string;
    /** Resolve a slug to its display label. */
    labelFor: (theme: string) => string;
};

/** Public props for ThemePicker. See `spec.md` §4 for the contract. */
export type Props = {
    /** Accessible label for the radiogroup. */
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
    /** `name` attribute shared by the radio inputs. */
    name?: string;
    /** File extension appended to each slug when constructing the URL. */
    extension?: string;
    /** Element that receives `data-theme`. Defaults to document.documentElement. */
    target?: HTMLElement | null;
    /** Optional pretty labels per slug. */
    themeLabels?: Record<string, string>;
    /** Extra CSS class on the <fieldset> root. */
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
import { onMounted, watch } from "vue";

const props = withDefaults(defineProps<Props>(), {
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
    return theme.charAt(0).toUpperCase() + theme.slice(1);
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

function setTheme(slug: string): void {
    emit("update:value", slug);
}

onMounted(() => {
    let initial = props.value;
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
    if (initial && initial !== props.value) {
        emit("update:value", initial);
        // The watch on props.value will pick this up and apply.
        return;
    }
    if (initial) applyTheme(initial);
});

watch(
    () => props.value,
    (next, prev) => {
        if (next && next !== prev) applyTheme(next);
    },
);

function onInputChange(e: Event) {
    const next = (e.target as HTMLInputElement).value;
    setTheme(next);
}
</script>

<template>
    <fieldset
        :class="`theme-picker ${props.class}`.trim()"
        role="radiogroup"
        :aria-label="label"
    >
        <slot
            :themes="themes"
            :value="value ?? ''"
            :set-theme="setTheme"
            :name="name"
            :label-for="labelFor"
        >
            <label
                v-for="theme in themes"
                :key="theme"
                class="theme-picker-option"
            >
                <input
                    type="radio"
                    :name="name"
                    :value="theme"
                    :checked="value === theme"
                    @change="onInputChange"
                />
                <span class="theme-picker-option-label">{{ labelFor(theme) }}</span>
            </label>
        </slot>
    </fieldset>
</template>
