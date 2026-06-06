<script lang="ts">
import {
    defaultLocaleLabels,
    RTL_LANGUAGE_TAGS,
    RTL_SCRIPT_SUBTAGS,
} from "./locales.js";

/** Arguments passed to the default scoped slot. */
export type SlotArgs = {
    /** The locale codes to render as options. */
    locales: string[];
    /** Currently selected locale code (consumer form, not BCP 47-normalised). */
    value: string;
    /** Apply a locale imperatively (also updates `v-model:value`). */
    setLocale: (locale: string) => void;
    /** Shared `name` attribute for the radio inputs. */
    name: string;
    /** Resolve a locale code to its display label. */
    labelFor: (locale: string) => string;
    /** BCP 47 hyphen-form of a locale code (`en_US` → `en-US`). */
    tagFor: (locale: string) => string;
    /** Is the locale right-to-left? */
    isRtl: (locale: string) => boolean;
};

/** Public props for LocalePicker. See `spec.md` §4 for the contract. */
export type Props = {
    /** Accessible label for the radiogroup. */
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
    /** `name` attribute shared by the radio inputs. */
    name?: string;
    /** Element that receives `lang` and `dir`. Defaults to document.documentElement. */
    target?: HTMLElement | null;
    /** If false, the picker only writes `lang` and never touches `dir`. */
    applyDir?: boolean;
    /** Optional pretty labels per locale code. */
    localeLabels?: Record<string, string>;
    /** Extra CSS class on the <fieldset> root. */
    class?: string;
};

// ---------------------------------------------------------------
// Pure helpers (exported so consumers can reuse them)
// ---------------------------------------------------------------

/** Convert a locale code to its BCP 47 hyphen form. */
export function bcp47LocaleTag(locale: string): string {
    return locale.replace(/_/g, "-");
}

/** Detect whether a locale is right-to-left. See spec.md §5.6. */
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
</script>

<script setup lang="ts">
import { onMounted, watch } from "vue";

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

function setLocale(code: string): void {
    emit("update:value", code);
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

    if (initial && initial !== props.value) {
        emit("update:value", initial);
        // watch will pick this up.
        return;
    }
    if (initial) applyLocale(initial);
});

watch(
    () => props.value,
    (next, prev) => {
        if (next && next !== prev) applyLocale(next);
    },
);

function onInputChange(e: Event) {
    const next = (e.target as HTMLInputElement).value;
    setLocale(next);
}
</script>

<template>
    <fieldset
        :class="`locale-picker ${props.class}`.trim()"
        role="radiogroup"
        :aria-label="label"
    >
        <slot
            :locales="locales"
            :value="value ?? ''"
            :set-locale="setLocale"
            :name="name"
            :label-for="labelFor"
            :tag-for="tagFor"
            :is-rtl="isRtlLocale"
        >
            <label
                v-for="locale in locales"
                :key="locale"
                class="locale-picker-option"
                :lang="tagFor(locale)"
            >
                <input
                    type="radio"
                    :name="name"
                    :value="locale"
                    :checked="value === locale"
                    @change="onInputChange"
                />
                <span class="locale-picker-option-label">{{ labelFor(locale) }}</span>
            </label>
        </slot>
    </fieldset>
</template>
