<script
    lang="ts"
    module
>
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
    import type { Props as LinkPickerProps, LinkItem } from "@lilydesignsystem/svelte-link-picker";

    /**
     * All 63 Lily reference theme slugs (see `themes/` at the repo root): the 36
     * generic themes alphabetically, then the 27 themes that follow a company's
     * or a public body's design system, alphabetically by their label
     * (`DEFAULT_THEME_LABELS`, else the title-cased slug), so "NHS England
     * (patients)" sorts under N.
     */
    export const DEFAULT_THEMES: string[] = [
        "abyss",
        "acid",
        "aqua",
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
        "fantasy",
        "forest",
        "garden",
        "halloween",
        "lemonade",
        "light",
        "lofi",
        "luxury",
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
        "adobe-spectrum",
        "ant-design",
        "atlassian",
        "australia-agriculture-design-system",
        "brazil-padrao-digital-de-governo",
        "canada-government-of-canada-design-system",
        "european-union-europa-component-library",
        "excel",
        "fluent",
        "github-primer",
        "united-kingdom-government-digital-service",
        "ibm-carbon",
        "japan-digital-agency-design-system",
        "linear",
        "mozilla-protocol",
        "united-kingdom-national-health-service-england-for-patients",
        "united-kingdom-national-health-service-england-for-practitioners",
        "united-kingdom-national-health-service-scotland-for-patients",
        "united-kingdom-national-health-service-scotland-for-practitioners",
        "united-kingdom-national-health-service-wales-for-patients",
        "united-kingdom-national-health-service-wales-for-practitioners",
        "notion",
        "salesforce",
        "sap-fiori",
        "singapore-government-design-system",
        "united-states-web-design-system",
        "vercel",
    ];

    /**
     * Labels for the default themes whose title-cased slug reads wrongly: an
     * abbreviation ("IBM Carbon", not "Ibm Carbon"), an accent or a small word,
     * or a public body's own short name ("NHS England (patients)"). They are
     * proper names, not prose to translate. A consumer's `themeProps.themeLabels`
     * wins over each one.
     */
    export const DEFAULT_THEME_LABELS: Record<string, string> = {
        cmyk: "CMYK",
        "brazil-padrao-digital-de-governo": "Brazil Padrão Digital de Governo",
        "canada-government-of-canada-design-system": "Canada Government of Canada Design System",
        "github-primer": "GitHub Primer",
        "ibm-carbon": "IBM Carbon",
        "sap-fiori": "SAP Fiori",
        "united-kingdom-government-digital-service": "GOV.UK Design System",
        "united-kingdom-national-health-service-england-for-patients": "NHS England (patients)",
        "united-kingdom-national-health-service-england-for-practitioners":
            "NHS England (practitioners)",
        "united-kingdom-national-health-service-scotland-for-patients": "NHS Scotland (patients)",
        "united-kingdom-national-health-service-scotland-for-practitioners":
            "NHS Scotland (practitioners)",
        "united-kingdom-national-health-service-wales-for-patients": "NHS Wales (patients)",
        "united-kingdom-national-health-service-wales-for-practitioners":
            "NHS Wales (practitioners)",
        "united-states-web-design-system": "U.S. Web Design System",
    };

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
        /**
         * Accessible name for the search picker's button and search landmark. Optional: omitted or empty, the bar has no search
         * picker (a client-side app whose search would navigate away from its state can leave it out). When given, `searchInput`
         * and `searchSubmit` are needed too.
         */
        search?: string;
        /** Accessible name for the search picker's text field. */
        searchInput?: string;
        /** Accessible name for the search picker's ⏎ submit button. */
        searchSubmit?: string;
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

<div
    class={`picker-bar ${className}`.trim()}
    {...restProps}
>
    {#if links.length > 0 && labels.link}
        <LinkPicker
            label={labels.link}
            {links}
            {...linkProps}
        />
    {/if}
    {#if labels.search}
        <SearchPicker
            label={labels.search}
            inputLabel={labels.searchInput ?? ""}
            submitLabel={labels.searchSubmit ?? ""}
            {...searchProps}
        />
    {/if}
    <ThemePicker
        label={labels.theme}
        {themesUrl}
        {themes}
        {...themeProps}
        themeLabels={{ ...DEFAULT_THEME_LABELS, ...(themeProps.themeLabels ?? {}) }}
    />
    <LocalePicker
        label={labels.locale}
        {locales}
        {...localeProps}
    />
    {#if labels.timeZone && timeZoneProps.locale}
        <TimeZonePicker
            label={labels.timeZone}
            locale={timeZoneProps.locale as string}
            {...timeZoneProps}
        />
    {/if}
    <TextSizePicker
        label={labels.textSize}
        {sizes}
        defaultValue="normal"
        {...textSizeProps}
    />
    <SharePicker
        label={labels.share}
        targets={shareTargets}
        {...shareProps}
    />
</div>
