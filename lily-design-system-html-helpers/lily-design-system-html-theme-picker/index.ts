/**
 * Barrel re-export for `<theme-picker>`.
 *
 * Importing this module registers the custom element under the tag
 * name `"theme-picker"`. Registration is idempotent — re-imports do
 * not throw. Consumers who want a different tag name can import the
 * class directly from `./theme-picker` and call
 * `customElements.define(...)` themselves.
 */

import { ThemePicker, normalizeThemesUrl, themeHref } from "./theme-picker.js";
export { ThemePicker, normalizeThemesUrl, themeHref };
export type { ThemePickerProps, ThemePickerChangeDetail } from "./theme-picker.js";

if (typeof customElements !== "undefined" && !customElements.get("theme-picker")) {
    customElements.define("theme-picker", ThemePicker);
}
