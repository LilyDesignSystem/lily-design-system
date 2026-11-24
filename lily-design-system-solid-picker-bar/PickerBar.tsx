import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import ThemePicker, { type Props as ThemePickerProps } from "@lilydesignsystem/solid-theme-picker";
import LocalePicker, {
    type Props as LocalePickerProps,
} from "@lilydesignsystem/solid-locale-picker";
import TextSizePicker, {
    type Props as TextSizePickerProps,
} from "@lilydesignsystem/solid-text-size-picker";
import TimeZonePicker, {
    type Props as TimeZonePickerProps,
} from "@lilydesignsystem/solid-time-zone-picker";
import SharePicker, {
    type Props as SharePickerProps,
    type ShareTarget,
} from "@lilydesignsystem/solid-share-picker";
import LinkPicker, {
    type Props as LinkPickerProps,
    type LinkItem,
} from "@lilydesignsystem/solid-link-picker";
import SearchPicker, {
    type Props as SearchPickerProps,
} from "@lilydesignsystem/solid-search-picker";

/**
 * All 65 Lily reference theme slugs (see `themes/` at the repo root), in one list sorted alphabetically by the name shown
 * (`DEFAULT_THEME_LABELS`, else the title-cased slug), so "IBM Carbon" sorts under I and "NHS England (patients)" under N.
 * Generic and company or public-sector themes are not grouped apart (spec/theme-picker, "Order of themes"). The theme picker
 * sorts its options the same way whatever order it is given.
 */
export const DEFAULT_THEMES: string[] = [
    "abyss",
    "acid",
    "adobe-spectrum",
    "ant-design",
    "aqua",
    "atlassian",
    "australia-agriculture-design-system",
    "autumn",
    "black",
    "brazil-padrao-digital-de-governo",
    "bumblebee",
    "business",
    "canada-government-of-canada-design-system",
    "cappuccino",
    "caramellatte",
    "cmyk",
    "coffee",
    "corporate",
    "cupcake",
    "cyberpunk",
    "dark",
    "dark-high-contrast",
    "dim",
    "dracula",
    "emerald",
    "european-union-europa-component-library",
    "excel",
    "fantasy",
    "fluent",
    "forest",
    "garden",
    "github-primer",
    "united-kingdom-government-digital-service",
    "halloween",
    "ibm-carbon",
    "japan-digital-agency-design-system",
    "lemonade",
    "light",
    "light-high-contrast",
    "linear",
    "lofi",
    "luxury",
    "mozilla-protocol",
    "united-kingdom-national-health-service-england-for-patients",
    "united-kingdom-national-health-service-england-for-practitioners",
    "united-kingdom-national-health-service-scotland-for-patients",
    "united-kingdom-national-health-service-scotland-for-practitioners",
    "united-kingdom-national-health-service-wales-for-patients",
    "united-kingdom-national-health-service-wales-for-practitioners",
    "night",
    "nord",
    "notion",
    "pastel",
    "retro",
    "salesforce",
    "sap-fiori",
    "silk",
    "singapore-government-design-system",
    "sunset",
    "synthwave",
    "united-states-web-design-system",
    "valentine",
    "vercel",
    "winter",
    "wireframe",
];

/**
 * Labels for the default themes whose title-cased slug reads wrongly: an
 * abbreviation ("IBM Carbon", not "Ibm Carbon"), an accent or a small word,
 * or a public body's own short name ("NHS England (patients)"). They are
 * proper names, not prose to translate. A consumer's own theme labels win
 * over each one.
 */
export const DEFAULT_THEME_LABELS: Record<string, string> = {
    cmyk: "CMYK",
    "brazil-padrao-digital-de-governo": "Brazil Padrão Digital de Governo",
    "canada-government-of-canada-design-system": "Canada Government of Canada Design System",
    "github-primer": "GitHub Primer",
    "dark-high-contrast": "Dark High-Contrast",
    "ibm-carbon": "IBM Carbon",
    "light-high-contrast": "Light High-Contrast",
    "sap-fiori": "SAP Fiori",
    "united-kingdom-government-digital-service": "GOV.UK Design System",
    "united-kingdom-national-health-service-england-for-patients": "NHS England (patients)",
    "united-kingdom-national-health-service-england-for-practitioners":
        "NHS England (practitioners)",
    "united-kingdom-national-health-service-scotland-for-patients": "NHS Scotland (patients)",
    "united-kingdom-national-health-service-scotland-for-practitioners":
        "NHS Scotland (practitioners)",
    "united-kingdom-national-health-service-wales-for-patients": "NHS Wales (patients)",
    "united-kingdom-national-health-service-wales-for-practitioners": "NHS Wales (practitioners)",
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

/** Accessible names for the five pickers. Required — no English default. */
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
export type Props = Omit<JSX.HTMLAttributes<HTMLDivElement>, "children"> & {
    /** Accessible names for each picker. */
    labels: PickerBarLabels;

    /** Page links for the link picker (a home icon), which renders FIRST — leftmost. Omitted or empty: no link picker. */
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
};

export function PickerBar(props: Props): JSX.Element {
    const p = withDefaults(
        {
            links: [] as NonNullable<Props["links"]>,
            linkProps: {} as NonNullable<Props["linkProps"]>,
            searchProps: {} as NonNullable<Props["searchProps"]>,
            themes: DEFAULT_THEMES,
            themeProps: {} as NonNullable<Props["themeProps"]>,
            localeProps: {} as NonNullable<Props["localeProps"]>,
            timeZoneProps: {} as NonNullable<Props["timeZoneProps"]>,
            sizes: DEFAULT_SIZES,
            textSizeProps: {} as NonNullable<Props["textSizeProps"]>,
            shareTargets: [] as NonNullable<Props["shareTargets"]>,
            shareProps: {} as NonNullable<Props["shareProps"]>,
            class: "" as const,
        },
        props,
    );
    const restProps = omit(
        p,
        "labels",
        "links",
        "linkProps",
        "searchProps",
        "themesUrl",
        "themes",
        "themeProps",
        "locales",
        "localeProps",
        "timeZoneProps",
        "sizes",
        "textSizeProps",
        "shareTargets",
        "shareProps",
        "class",
    );
    return (
        <div
            class={`picker-bar ${p.class}`.trim()}
            {...restProps}
        >
            {p.links.length > 0 && p.labels.link ? (
                <LinkPicker
                    label={p.labels.link}
                    links={p.links}
                    {...p.linkProps}
                />
            ) : null}
            {p.labels.search ? (
                <SearchPicker
                    label={p.labels.search}
                    inputLabel={p.labels.searchInput ?? ""}
                    submitLabel={p.labels.searchSubmit ?? ""}
                    {...p.searchProps}
                />
            ) : null}
            <ThemePicker
                label={p.labels.theme}
                themesUrl={p.themesUrl}
                themes={p.themes}
                {...p.themeProps}
                themeLabels={{ ...DEFAULT_THEME_LABELS, ...(p.themeProps?.themeLabels ?? {}) }}
            />
            <LocalePicker
                label={p.labels.locale}
                locales={p.locales}
                {...p.localeProps}
            />
            {p.labels.timeZone && p.timeZoneProps.locale ? (
                <TimeZonePicker
                    {...(p.timeZoneProps as TimeZonePickerProps)}
                    label={p.labels.timeZone}
                />
            ) : null}
            <TextSizePicker
                label={p.labels.textSize}
                sizes={p.sizes}
                defaultValue="normal"
                {...p.textSizeProps}
            />
            <SharePicker
                label={p.labels.share}
                targets={p.shareTargets}
                {...p.shareProps}
            />
        </div>
    );
}

export default PickerBar;
