/**
 * Barrel re-export for `<theme-select>`.
 *
 * Importing this module registers the custom element under the tag
 * name `"theme-select"`. Registration is idempotent — re-imports do
 * not throw. Consumers who want a different tag name can import the
 * class directly from `./theme-select` and call
 * `customElements.define(...)` themselves.
 */

import { ThemeSelect, normalizeThemesUrl, themeHref } from "./theme-select.js";
export { ThemeSelect, normalizeThemesUrl, themeHref };
export type { ThemeSelectProps, ThemeSelectChangeDetail } from "./theme-select.js";

if (typeof customElements !== "undefined" && !customElements.get("theme-select")) {
    customElements.define("theme-select", ThemeSelect);
}
