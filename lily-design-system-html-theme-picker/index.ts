/**
 * Barrel re-export for `<theme-picker>`.
 *
 * Importing this module registers the custom element under the tag
 * name `"theme-picker"`. Registration is idempotent — re-imports do
 * not throw. Consumers who want a different tag name can import the
 * class directly from `./theme-picker` and call
 * `customElements.define(...)` themselves.
 */

import {
    ThemePicker,
    themeName,
    matchSystemTheme,
    normalizeThemesUrl,
    themeHref,
    nextThemePickerId,
} from "./theme-picker.js";
export {
    ThemePicker,
    themeName,
    matchSystemTheme,
    normalizeThemesUrl,
    themeHref,
    nextThemePickerId,
};
export type { ThemePickerProps, ThemePickerChangeDetail } from "./theme-picker.js";
export {
    SYSTEM_THEME,
    DEFAULT_SYSTEM_THEMES,
    THEME_COOKIE_MAX_AGE,
    prefersDarkScheme,
    watchColorScheme,
    resolveTheme,
    themeChoices,
    readThemeCookie,
    themeCookie,
    readDocumentThemeCookie,
    writeDocumentThemeCookie,
} from "./theme-choice.js";
export type { SystemThemes } from "./theme-choice.js";

if (typeof customElements !== "undefined" && !customElements.get("theme-picker")) {
    customElements.define("theme-picker", ThemePicker);
}
