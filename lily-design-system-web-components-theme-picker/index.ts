/**
 * Barrel re-export for `<lily-theme-picker>`.
 *
 * Importing this module registers the custom element under the tag
 * name `"lily-theme-picker"`. Registration is idempotent — re-imports do
 * not throw. Consumers who want a different tag name can import the
 * class directly from `./theme-picker` and call
 * `customElements.define(...)` themselves.
 *
 * Depends on `@lilydesignsystem/web-components-headless` for the
 * trigger button (`<lily-icon-button>`, composed rather than
 * hand-rolled — see theme-picker.ts's `#render()`). Importing that
 * package here (for its side effect) registers `lily-icon-button`
 * before `#render()` ever runs.
 */

import "@lilydesignsystem/web-components-headless";
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

if (typeof customElements !== "undefined" && !customElements.get("lily-theme-picker")) {
    customElements.define("lily-theme-picker", ThemePicker);
}
