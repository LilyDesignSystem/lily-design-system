/**
 * Barrel re-export for `<theme-chooser>`.
 *
 * Importing this module registers the custom element under the tag
 * name `"theme-chooser"`. Registration is idempotent — re-imports do
 * not throw. Consumers who want a different tag name can import the
 * class directly from `./theme-chooser` and call
 * `customElements.define(...)` themselves.
 */

import {
    ThemeChooser,
    themeName,
    matchSystemTheme,
    normalizeThemesUrl,
    themeHref,
    nextThemeChooserId,
    CIRCLE_WITH_RIGHT_HALF_BLACK,
} from "./theme-chooser.js";
export {
    ThemeChooser,
    themeName,
    matchSystemTheme,
    normalizeThemesUrl,
    themeHref,
    nextThemeChooserId,
    CIRCLE_WITH_RIGHT_HALF_BLACK,
};
export type { ThemeChooserProps, ThemeChooserChangeDetail } from "./theme-chooser.js";

if (typeof customElements !== "undefined" && !customElements.get("theme-chooser")) {
    customElements.define("theme-chooser", ThemeChooser);
}
