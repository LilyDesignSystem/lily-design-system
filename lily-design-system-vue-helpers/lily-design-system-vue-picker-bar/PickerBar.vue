<script lang="ts">
import ThemePicker from "@lilydesignsystem/vue-theme-picker";
import LocalePicker from "@lilydesignsystem/vue-locale-picker";
import TextSizePicker from "@lilydesignsystem/vue-text-size-picker";
import SharePicker from "@lilydesignsystem/vue-share-picker";
import type { Props as ThemePickerProps } from "@lilydesignsystem/vue-theme-picker";
import type { Props as LocalePickerProps } from "@lilydesignsystem/vue-locale-picker";
import type { Props as TextSizePickerProps } from "@lilydesignsystem/vue-text-size-picker";
import type {
    Props as SharePickerProps,
    ShareTarget,
} from "@lilydesignsystem/vue-share-picker";

/**
 * All 45 Lily reference theme slugs (see `themes/` at the repo root),
 * sorted alphabetically except the United Kingdom and United States
 * government/public-sector themes, which sort last as one alphabetical
 * group of their own. Mirrors `theme-picker`'s own title-casing of each
 * slug, so no `themeLabels` override is needed for these to read well.
 */
export const DEFAULT_THEMES: string[] = [
    "abyss",
    "acid",
    "adobe-spectrum",
    "aqua",
    "autumn",
    "black",
    "bumblebee",
    "business",
    "caramellatte",
    "cmyk",
    "coffee",
    "corporate",
    "cupcake",
    "cyberpunk",
    "dark",
    "dim",
    "dracula",
    "emerald",
    "fantasy",
    "forest",
    "garden",
    "halloween",
    "lemonade",
    "light",
    "lofi",
    "luxury",
    "mozilla-protocol",
    "night",
    "nord",
    "pastel",
    "retro",
    "silk",
    "sunset",
    "synthwave",
    "valentine",
    "winter",
    "wireframe",
    "united-kingdom-government-digital-service",
    "united-kingdom-national-health-service-england-for-patients",
    "united-kingdom-national-health-service-england-for-practitioners",
    "united-kingdom-national-health-service-scotland-for-patients",
    "united-kingdom-national-health-service-scotland-for-practitioners",
    "united-kingdom-national-health-service-wales-for-patients",
    "united-kingdom-national-health-service-wales-for-practitioners",
    "united-states-web-design-system",
];

/**
 * The seven-step text-size scale. Each slug title-cases to exactly the
 * requested label ("largest" → "Largest", …) via `text-size-picker`'s
 * own default `labelFor`, so no `sizeLabels` override is needed either.
 */
export const DEFAULT_SIZES: string[] = [
    "largest",
    "larger",
    "large",
    "normal",
    "small",
    "smaller",
    "smallest",
];

/** Accessible names for the four pickers. Required — no English default. */
export type PickerBarLabels = {
    /** Accessible name for the theme picker's button and listbox. */
    theme: string;
    /** Accessible name for the locale picker's button and listbox. */
    locale: string;
    /** Accessible name for the text-size picker's button and listbox. */
    textSize: string;
    /** Accessible name for the share picker's button and list. */
    share: string;
};

/** Public props for PickerBar. See `spec/index.md` §4 for the contract. */
export type Props = {
    /** Accessible names for each picker. */
    labels: PickerBarLabels;

    /** Base URL of the themes directory, forwarded to ThemePicker. */
    themesUrl: string;
    /** Available theme slugs. Defaults to {@link DEFAULT_THEMES}. */
    themes?: string[];
    /** Extra ThemePicker props, bound after this bar's own (v-bind="themeProps"). */
    themeProps?: Partial<
        Omit<ThemePickerProps, "label" | "themesUrl" | "themes" | "class">
    >;

    /** Available locale codes. No catalog default exists — supply the set you support. */
    locales: string[];
    /** Extra LocalePicker props, bound after this bar's own. */
    localeProps?: Partial<Omit<LocalePickerProps, "label" | "locales" | "class">>;

    /** Available size slugs. Defaults to {@link DEFAULT_SIZES}. */
    sizes?: string[];
    /** Extra TextSizePicker props, bound after this bar's own. */
    textSizeProps?: Partial<
        Omit<TextSizePickerProps, "label" | "sizes" | "class">
    >;

    /** Destinations offered by the share picker. Empty is valid if `shareProps.copyLabel` is set. */
    shareTargets?: ShareTarget[];
    /** Extra SharePicker props, bound after this bar's own. */
    shareProps?: Partial<Omit<SharePickerProps, "label" | "targets" | "class">>;

    /** Extra CSS class on the root element. */
    class?: string;
};
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<Props>(), {
    themes: () => DEFAULT_THEMES,
    themeProps: () => ({}),
    localeProps: () => ({}),
    sizes: () => DEFAULT_SIZES,
    textSizeProps: () => ({}),
    shareTargets: () => [],
    shareProps: () => ({}),
    class: "",
});

// Vue separates props from events by design, so — unlike the Svelte
// canonical's `onChange` prop inside each `*Props` bag — the Vue port
// re-emits each wrapped picker's own event under a bar-scoped name,
// fully typed, rather than accepting an untyped `onChange` key inside
// `themeProps` et al.
const emit = defineEmits<{
    (event: "theme-change", value: string): void;
    (event: "locale-change", value: string): void;
    (event: "text-size-change", value: string): void;
    (event: "share", targetId: string, url: string): void;
    (event: "copy", url: string): void;
    (event: "native-share", url: string): void;
}>();
</script>

<template>
    <div :class="`picker-bar ${props.class}`.trim()">
        <ThemePicker
            :label="labels.theme"
            :themesUrl="themesUrl"
            :themes="themes"
            v-bind="themeProps"
            @change="(value: string) => emit('theme-change', value)"
        />
        <LocalePicker
            :label="labels.locale"
            :locales="locales"
            v-bind="localeProps"
            @change="(value: string) => emit('locale-change', value)"
        />
        <TextSizePicker
            :label="labels.textSize"
            :sizes="sizes"
            defaultValue="normal"
            v-bind="textSizeProps"
            @change="(value: string) => emit('text-size-change', value)"
        />
        <SharePicker
            :label="labels.share"
            :targets="shareTargets"
            v-bind="shareProps"
            @share="(targetId: string, url: string) => emit('share', targetId, url)"
            @copy="(url: string) => emit('copy', url)"
            @nativeShare="(url: string) => emit('native-share', url)"
        />
    </div>
</template>
