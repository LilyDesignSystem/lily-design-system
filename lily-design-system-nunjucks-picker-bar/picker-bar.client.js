// PickerBar client-side runtime.
//
// Pairs with picker-bar.njk. Unlike every other helper in this catalog,
// this module owns NO lifecycle of its own: search-picker.client.js,
// theme-picker.client.js, locale-picker.client.js,
// text-size-picker.client.js, and share-picker.client.js already own
// theirs, in full, independently of
// nesting (each scans the document for its own `data-lily-*-picker-root`
// hook). This module is a convenience wrapper that wires all five at
// once, scoped to one `picker-bar` root, instead of requiring the
// consumer to call five separate `init*Picker` functions.
//
// See spec/index.md §4.3 (client.js exports), §5 (behaviour).

import {
    initLinkPicker,
    autoInit as autoInitLinkPicker,
} from "@lilydesignsystem/nunjucks-link-picker";
import {
    initSearchPicker,
    autoInit as autoInitSearchPicker,
} from "@lilydesignsystem/nunjucks-search-picker";
import {
    initThemePicker,
    autoInit as autoInitThemePicker,
} from "@lilydesignsystem/nunjucks-theme-picker";
import {
    initLocalePicker,
    autoInit as autoInitLocalePicker,
} from "@lilydesignsystem/nunjucks-locale-picker";
import {
    initTextSizePicker,
    autoInit as autoInitTextSizePicker,
} from "@lilydesignsystem/nunjucks-text-size-picker";
import {
    initTimeZonePicker,
    autoInit as autoInitTimeZonePicker,
} from "@lilydesignsystem/nunjucks-time-zone-picker";
import {
    initSharePicker,
    autoInit as autoInitSharePicker,
} from "@lilydesignsystem/nunjucks-share-picker";

/**
 * All 63 Lily reference theme slugs (see `themes/` at the repo root), in one list sorted alphabetically by the name shown
 * (`DEFAULT_THEME_LABELS`, else the title-cased slug), so "IBM Carbon" sorts under I and "NHS England (patients)" under N.
 * Generic and company or public-sector themes are not grouped apart (spec/theme-picker, "Order of themes"). The theme picker
 * sorts its options the same way whatever order it is given.
 * Kept in the same order as `DEFAULT_THEMES` in picker-bar.njk by a test,
 * since a Nunjucks macro cannot import a JS constant.
 */
export const DEFAULT_THEMES = [
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
export const DEFAULT_THEME_LABELS = {
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

/** The seven-step text-size scale, largest first. */
export const DEFAULT_SIZES = [
    "largest",
    "larger",
    "large",
    "normal",
    "small",
    "smaller",
    "smallest",
];

/**
 * Wire the five pickers inside one `[data-lily-picker-bar-root]`
 * element. Each nested picker root is found and handed to its own
 * sibling package's `init*Picker(root, opts)` — no different from
 * calling all five by hand, just in one call. `searchProps` is where
 * search-picker's function-valued options (`navigate`, `onSearch`) go,
 * since a macro cannot carry a function; `action` here overrides the
 * rendered one.
 *
 * @param {HTMLElement} root
 * @param {{linkProps?: object, searchProps?: object, themeProps?: object, localeProps?: object, timeZoneProps?: object, textSizeProps?: object, shareProps?: object}=} opts
 */
export function initPickerBar(root, opts = {}) {
    if (!root) {
        return {
            link: null,
            search: null,
            theme: null,
            locale: null,
            timeZone: null,
            textSize: null,
            share: null,
        };
    }
    const {
        linkProps = {},
        searchProps = {},
        themeProps = {},
        localeProps = {},
        timeZoneProps = {},
        textSizeProps = {},
        shareProps = {},
    } = opts;

    const linkRoot = root.querySelector("[data-lily-link-picker-root]");
    const searchRoot = root.querySelector("[data-lily-search-picker-root]");
    const themeRoot = root.querySelector("[data-lily-theme-picker-root]");
    const localeRoot = root.querySelector("[data-lily-locale-picker-root]");
    const timeZoneRoot = root.querySelector("[data-lily-time-zone-picker-root]");
    const textSizeRoot = root.querySelector("[data-lily-text-size-picker-root]");
    const shareRoot = root.querySelector("[data-lily-share-picker-root]");

    return {
        link: linkRoot ? initLinkPicker(linkRoot, linkProps) : null,
        search: searchRoot ? initSearchPicker(searchRoot, searchProps) : null,
        theme: themeRoot ? initThemePicker(themeRoot, themeProps) : null,
        locale: localeRoot ? initLocalePicker(localeRoot, localeProps) : null,
        timeZone: timeZoneRoot ? initTimeZonePicker(timeZoneRoot, timeZoneProps) : null,
        textSize: textSizeRoot ? initTextSizePicker(textSizeRoot, textSizeProps) : null,
        share: shareRoot ? initSharePicker(shareRoot, shareProps) : null,
    };
}

/**
 * Find every `[data-lily-picker-bar-root]` and wire it.
 *
 * @param {{linkProps?: object, searchProps?: object, themeProps?: object, localeProps?: object, timeZoneProps?: object, textSizeProps?: object, shareProps?: object}=} opts
 * @returns {Array<ReturnType<typeof initPickerBar>>}
 */
export function autoInit(opts = {}) {
    if (typeof document === "undefined") return [];
    const roots = Array.from(document.querySelectorAll("[data-lily-picker-bar-root]"));
    return roots.map((root) => initPickerBar(root, opts));
}

// Re-exported so a consumer who only loaded picker-bar.client.js can
// still reach the five siblings' own page-wide autoInit directly, e.g.
// when a page also has a standalone theme-picker outside any bar.
export {
    autoInitLinkPicker,
    autoInitSearchPicker,
    autoInitThemePicker,
    autoInitLocalePicker,
    autoInitTextSizePicker,
    autoInitSharePicker,
};
