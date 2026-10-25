<script lang="ts" module>
    import ThemePicker from "@lilydesignsystem/svelte-theme-picker";
    import LocalePicker from "@lilydesignsystem/svelte-locale-picker";
    import TextSizePicker from "@lilydesignsystem/svelte-text-size-picker";
    import SharePicker from "@lilydesignsystem/svelte-share-picker";
    import SearchPicker from "@lilydesignsystem/svelte-search-picker";
    import LinkPicker from "@lilydesignsystem/svelte-link-picker";
    import TimeZonePicker from "@lilydesignsystem/svelte-time-zone-picker";
    import type { Props as TimeZonePickerProps } from "@lilydesignsystem/svelte-time-zone-picker";
    import type { Props as ThemePickerProps } from "@lilydesignsystem/svelte-theme-picker";
    import type { Props as LocalePickerProps } from "@lilydesignsystem/svelte-locale-picker";
    import type { Props as TextSizePickerProps } from "@lilydesignsystem/svelte-text-size-picker";
    import type {
        Props as SharePickerProps,
        ShareTarget,
    } from "@lilydesignsystem/svelte-share-picker";
    import type { Props as SearchPickerProps } from "@lilydesignsystem/svelte-search-picker";
    import type {
        Props as LinkPickerProps,
        LinkItem,
    } from "@lilydesignsystem/svelte-link-picker";

    /**
     * All 57 Lily reference theme slugs (see `themes/` at the repo root),
     * sorted alphabetically except the United Kingdom and United States
     * government/public-sector themes, which sort last as one alphabetical
     * group of their own. Mirrors `theme-picker`'s own title-casing of each
     * slug, so no `themeLabels` override is needed for these to read well.
     */
    export const DEFAULT_THEMES: string[] = [
        "abyss",
        "acid",
        "adobe-spectrum",
        "ant-design",
        "aqua",
        "atlassian",
        "autumn",
        "black",
        "bumblebee",
        "business",
        "cappuccino",
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
        "excel",
        "fantasy",
        "fluent",
        "forest",
        "garden",
        "github-primer",
        "halloween",
        "ibm-carbon",
        "lemonade",
        "light",
        "linear",
        "lofi",
        "luxury",
        "mozilla-protocol",
        "night",
        "nord",
        "notion",
        "pastel",
        "retro",
        "salesforce",
        "sap-fiori",
        "silk",
        "sunset",
        "synthwave",
        "valentine",
        "vercel",
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

    /** Accessible names for the pickers. Required — no English default (`link` only when `links` is given). */
    export type PickerBarLabels = {
        /**
         * Accessible name for the link picker's button and list. Needed only when `links` is
         * supplied; the link picker renders only when both are present.
         */
        link?: string;
        /** Accessible name for the search picker's button and search landmark. */
        search: string;
        /** Accessible name for the search picker's text field. */
        searchInput: string;
        /** Accessible name for the search picker's ⏎ submit button. */
        searchSubmit: string;
        /** Accessible name for the theme picker's button and listbox. */
        theme: string;
        /** Accessible name for the locale picker's button and listbox. */
        locale: string;
        /** Accessible name for the text-size picker's button and listbox. */
        textSize: string;
        /**
         * Accessible name for the time-zone picker's button and listbox. Needed only when
         * `timeZoneProps.locale` is supplied; the time-zone picker renders only when both are present.
         */
        timeZone?: string;
        /** Accessible name for the share picker's button and list. */
        share: string;
    };

    /** Public props for PickerBar. See `spec/index.md` §4 for the contract. */
    export type Props = {
        /** Accessible names for each picker. */
        labels: PickerBarLabels;

        /**
         * Page links for the link picker (a home icon), which renders FIRST — leftmost — in the bar.
         * Defined by the app; omitted or empty means no link picker (and `labels.link` is then unused).
         */
        links?: LinkItem[];
        /** Extra LinkPicker props (e.g. `navigate`, `onNavigate`), spread after this bar's own. */
        linkProps?: Partial<Omit<LinkPickerProps, "label" | "links">>;

        /** Extra SearchPicker props (e.g. `action`, `navigate`, `placeholder`), spread after this bar's own. */
        searchProps?: Partial<Omit<SearchPickerProps, "label" | "inputLabel" | "submitLabel">>;

        /** Base URL of the themes directory, forwarded to ThemePicker. */
        themesUrl: string;
        /** Available theme slugs. Defaults to {@link DEFAULT_THEMES}. */
        themes?: string[];
        /** Extra ThemePicker props, spread after this bar's own. */
        themeProps?: Partial<Omit<ThemePickerProps, "themesUrl" | "themes">>;

        /** Available locale codes. No catalog default exists — supply the set you support. */
        locales: string[];
        /** Extra LocalePicker props, spread after this bar's own. */
        localeProps?: Partial<Omit<LocalePickerProps, "locales">>;

        /**
         * Extra TimeZonePicker props, spread after this bar's own. `locale` (the language that names and sorts
         * the zones) is required for the time-zone picker to render, which sits after the locale picker.
         */
        timeZoneProps?: Partial<Omit<TimeZonePickerProps, "label">>;

        /** Available size slugs. Defaults to {@link DEFAULT_SIZES}. */
        sizes?: string[];
        /** Extra TextSizePicker props, spread after this bar's own. */
        textSizeProps?: Partial<Omit<TextSizePickerProps, "sizes">>;

        /** Destinations offered by the share picker. Empty is valid if `shareProps.copyLabel` is set. */
        shareTargets?: ShareTarget[];
        /** Extra SharePicker props, spread after this bar's own. */
        shareProps?: Partial<Omit<SharePickerProps, "targets">>;

        /** Extra CSS class on the root. */
        class?: string;
        /** Spread props onto the root element. */
        [key: string]: unknown;
    };
</script>

<script lang="ts">
    let {
        class: className = "",
        labels,
        links = [],
        linkProps = {},
        searchProps = {},
        themesUrl,
        themes = DEFAULT_THEMES,
        themeProps = {},
        locales,
        localeProps = {},
        timeZoneProps = {},
        sizes = DEFAULT_SIZES,
        textSizeProps = {},
        shareTargets = [],
        shareProps = {},
        ...restProps
    }: Props = $props();
</script>

<div class={`picker-bar ${className}`.trim()} {...restProps}>
    {#if links.length > 0 && labels.link}
        <LinkPicker label={labels.link} {links} {...linkProps} />
    {/if}
    <SearchPicker
        label={labels.search}
        inputLabel={labels.searchInput}
        submitLabel={labels.searchSubmit}
        {...searchProps}
    />
    <ThemePicker
        label={labels.theme}
        {themesUrl}
        {themes}
        {...themeProps}
    />
    <LocalePicker label={labels.locale} {locales} {...localeProps} />
    {#if labels.timeZone && timeZoneProps.locale}
        <TimeZonePicker
            label={labels.timeZone}
            locale={timeZoneProps.locale}
            {...timeZoneProps}
        />
    {/if}
    <TextSizePicker
        label={labels.textSize}
        {sizes}
        defaultValue="normal"
        {...textSizeProps}
    />
    <SharePicker label={labels.share} targets={shareTargets} {...shareProps} />
</div>
