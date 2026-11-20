import { ChangeDetectionStrategy, Component, computed, input, model, output } from "@angular/core";

import {
    LinkPicker,
    type LinkItem,
    type LinkNavigatedEvent,
} from "@lilydesignsystem/angular-link-picker";
import { ThemePicker } from "@lilydesignsystem/angular-theme-picker";
import { LocalePicker } from "@lilydesignsystem/angular-locale-picker";
import { TextSizePicker } from "@lilydesignsystem/angular-text-size-picker";
import {
    TimeZonePicker,
    DEFAULT_ZONES,
    type ZoneInfo,
    type ZoneNames,
} from "@lilydesignsystem/angular-time-zone-picker";
import {
    SharePicker,
    type ShareEvent,
    type ShareStrategy,
    type ShareTarget,
} from "@lilydesignsystem/angular-share-picker";
import { SearchPicker, type SearchEvent } from "@lilydesignsystem/angular-search-picker";

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
 * proper names, not prose to translate. A consumer's own theme labels win
 * over each one.
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
     * `timeZoneLocale` is supplied; the time-zone picker renders only when both are present.
     */
    timeZone?: string;
    /** Accessible name for the share picker's button and list. */
    share: string;
};

/**
 * PickerBar — composes search-picker, theme-picker, locale-picker,
 * text-size-picker, and share-picker into one page-header row.
 *
 * A thin wrapper: it renders the five picker components, each imported
 * as a real npm dependency from its own published package, unmodified.
 * It pre-wires two catalog-specific defaults (`DEFAULT_THEMES`,
 * `DEFAULT_SIZES`) and flattens each wrapped picker's most commonly
 * needed optional props onto its own inputs — Angular has no spread
 * binding for component inputs, so unlike the canonical Svelte
 * contract's `*Props` bag, overrides here are named inputs rather than
 * an object spread. `motion-picker` and `date-time-picker` are
 * deliberately not included — see `spec/index.md` §1.
 */
@Component({
    selector: "lily-picker-bar",
    standalone: true,
    imports: [
        LinkPicker,
        SearchPicker,
        ThemePicker,
        LocalePicker,
        TextSizePicker,
        TimeZonePicker,
        SharePicker,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
    <div class="picker-bar {{ className() }}">
      @if (links().length > 0 && labels().link) {
        <lily-link-picker
          [label]="labels().link!"
          [links]="links()"
          [navigate]="linkNavigate()"
          (navigated)="linkNavigated.emit($event)"
        />
      }
      @if (labels().search) {
        <lily-search-picker
          [label]="labels().search ?? ''"
          [inputLabel]="labels().searchInput ?? ''"
          [submitLabel]="labels().searchSubmit ?? ''"
          [placeholder]="searchPlaceholder()"
          [(value)]="searchValue"
          [action]="searchAction()"
          [navigate]="searchNavigate()"
          (searched)="searched.emit($event)"
        />
      }
      <lily-theme-picker
        [label]="labels().theme"
        [themesUrl]="themesUrl()"
        [themes]="themes()"
        [(value)]="themeValue"
        [defaultValue]="themeDefaultValue()"
        [storageKey]="themeStorageKey()"
        [detectFromSystem]="themeDetectFromSystem()"
        [name]="themeName()"
        [target]="themeTarget()"
        [themeLabels]="mergedThemeLabels()"
      />
      <lily-locale-picker
        [label]="labels().locale"
        [locales]="locales()"
        [(value)]="localeValue"
        [defaultValue]="localeDefaultValue()"
        [storageKey]="localeStorageKey()"
        [detectFromNavigator]="localeDetectFromNavigator()"
        [name]="localeName()"
        [target]="localeTarget()"
        [applyDir]="localeApplyDir()"
        [localeLabels]="localeLabels()"
      />
      @if (labels().timeZone && timeZoneLocale()) {
        <lily-time-zone-picker
          [label]="labels().timeZone!"
          [locale]="timeZoneLocale()!"
          [zones]="timeZones()"
          [date]="timeZoneDate()"
          [labelFor]="timeZoneLabelFor()"
          [names]="timeZoneNames()"
          [(value)]="timeZoneValue"
          [defaultValue]="timeZoneDefaultValue()"
          [storageKey]="timeZoneStorageKey()"
          [name]="timeZoneName()"
          [target]="timeZoneTarget()"
        />
      }
      <lily-text-size-picker
        [label]="labels().textSize"
        [sizes]="sizes()"
        [(value)]="textSizeValue"
        [defaultValue]="textSizeDefaultValue()"
        [storageKey]="textSizeStorageKey()"
        [name]="textSizeName()"
        [target]="textSizeTarget()"
        [sizeLabels]="textSizeLabels()"
      />
      <lily-share-picker
        [label]="labels().share"
        [targets]="shareTargets()"
        [url]="shareUrl()"
        [title]="shareTitle()"
        [text]="shareText()"
        [copyLabel]="copyLabel()"
        [copiedLabel]="copiedLabel()"
        [copyFailedLabel]="copyFailedLabel()"
        [strategy]="shareStrategy()"
        (share)="share.emit($event)"
        (copy)="copy.emit($event)"
        (nativeShare)="nativeShare.emit($event)"
      />
    </div>
  `,
})
export class PickerBar {
    /** Accessible names for each picker. */
    readonly labels = input.required<PickerBarLabels>();

    // --- link-picker ---
    /**
     * Page links for the link picker (a home icon), which renders FIRST — leftmost. Defined by the
     * app; omitted or empty means no link picker (and `labels().link` is then unused).
     */
    readonly links = input<LinkItem[]>([]);
    /** Client-side navigation hook for the links, e.g. a router's `navigateByUrl`. */
    readonly linkNavigate = input<((href: string) => void) | undefined>(undefined);
    /** Fires after a page link is chosen. */
    readonly linkNavigated = output<LinkNavigatedEvent>();

    // --- search-picker ---
    /** Placeholder for the search field. No default (it would be English). */
    readonly searchPlaceholder = input<string | undefined>(undefined);
    /** Two-way bindable search text. */
    readonly searchValue = model<string>("");
    /** Path the query is appended to (`${searchAction}?${query}`). */
    readonly searchAction = input<string>("/");
    /** Performs the search navigation. Defaults to `location.assign(href)`. */
    readonly searchNavigate = input<((href: string) => void) | undefined>(undefined);
    /** Fires with the trimmed query and destination, before navigating. */
    readonly searched = output<SearchEvent>();

    // --- theme-picker ---
    /** Base URL of the themes directory, forwarded to ThemePicker. */
    readonly themesUrl = input.required<string>();
    /** Available theme slugs. Defaults to {@link DEFAULT_THEMES}. */
    readonly themes = input<string[]>(DEFAULT_THEMES);
    /** Two-way bindable current theme slug. */
    readonly themeValue = model<string>("");
    readonly themeDefaultValue = input<string>("");
    readonly themeStorageKey = input<string>("");
    readonly themeDetectFromSystem = input<boolean>(false);
    readonly themeName = input<string>("theme");
    readonly themeTarget = input<HTMLElement | null>(null);
    readonly themeLabels = input<Record<string, string>>({});
    /** `DEFAULT_THEME_LABELS` under the consumer's own `themeLabels`, which win. */
    protected readonly mergedThemeLabels = computed(() => ({
        ...DEFAULT_THEME_LABELS,
        ...this.themeLabels(),
    }));

    // --- locale-picker ---
    /** Available locale codes. No catalog default exists — supply the set you support. */
    readonly locales = input.required<string[]>();
    /** Two-way bindable current locale code. */
    readonly localeValue = model<string>("");
    readonly localeDefaultValue = input<string>("");
    readonly localeStorageKey = input<string>("");
    readonly localeDetectFromNavigator = input<boolean>(false);
    readonly localeName = input<string>("locale");
    readonly localeTarget = input<HTMLElement | null>(null);
    readonly localeApplyDir = input<boolean>(true);
    readonly localeLabels = input<Record<string, string>>({});

    // --- time-zone-picker ---
    /**
     * The language that names and sorts the zones (BCP 47, e.g. `fr`). The time-zone picker, which sits
     * after the locale picker, renders only when this and `labels().timeZone` are both given.
     */
    readonly timeZoneLocale = input<string | undefined>(undefined);
    /** IANA zone ids on offer. Defaults to the picker's own 55. */
    readonly timeZones = input<readonly string[]>(DEFAULT_ZONES);
    /** The date the offsets are computed for (daylight time). Defaults to now. */
    readonly timeZoneDate = input<Date | undefined>(undefined);
    readonly timeZoneLabelFor = input<((zone: ZoneInfo) => string) | undefined>(undefined);
    /** CLDR zone names, e.g. `zoneNamesFrom(pack)` from the locale-translations package. */
    readonly timeZoneNames = input<ZoneNames | undefined>(undefined);
    /** Two-way bindable current IANA zone id. */
    readonly timeZoneValue = model<string>("");
    readonly timeZoneDefaultValue = input<string>("");
    readonly timeZoneStorageKey = input<string>("");
    readonly timeZoneName = input<string>("time-zone");
    readonly timeZoneTarget = input<HTMLElement | null>(null);

    // --- text-size-picker ---
    /** Available size slugs. Defaults to {@link DEFAULT_SIZES}. */
    readonly sizes = input<string[]>(DEFAULT_SIZES);
    /** Two-way bindable current size slug. */
    readonly textSizeValue = model<string>("");
    /**
     * `text-size-picker`'s own fallback ("medium", else `sizes[0]`) does
     * not fit the seven-slug scale — "medium" is not one of the seven,
     * and `sizes[0]` would silently start every consumer on "Largest".
     */
    readonly textSizeDefaultValue = input<string>("normal");
    readonly textSizeStorageKey = input<string>("");
    readonly textSizeName = input<string>("text-size");
    readonly textSizeTarget = input<HTMLElement | null>(null);
    readonly textSizeLabels = input<Record<string, string>>({});

    // --- share-picker ---
    /** Destinations offered by the share picker. Empty is valid if `copyLabel` is set. */
    readonly shareTargets = input<ShareTarget[]>([]);
    readonly shareUrl = input<string>("");
    readonly shareTitle = input<string>("");
    readonly shareText = input<string>("");
    readonly copyLabel = input<string>("");
    readonly copiedLabel = input<string>("");
    readonly copyFailedLabel = input<string>("");
    readonly shareStrategy = input<ShareStrategy>("auto");
    /** Fires after a share destination is chosen. */
    readonly share = output<ShareEvent>();
    /** Fires after the URL is copied. */
    readonly copy = output<string>();
    /** Fires when the native share sheet was used instead of the list. */
    readonly nativeShare = output<string>();

    /** Extra CSS class on the root. */
    readonly className = input<string>("");
}
