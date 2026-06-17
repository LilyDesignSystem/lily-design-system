/**
 * Barrel re-export for `<locale-select>`.
 *
 * Importing this module registers the custom element under the tag
 * name `"locale-select"`. Registration is idempotent — re-imports do
 * not throw. Consumers who want a different tag name can import the
 * class directly from `./locale-select` and call
 * `customElements.define(...)` themselves.
 */

import {
    LocaleSelect,
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
    defaultLocaleLabels,
    RTL_LANGUAGE_TAGS,
    RTL_SCRIPT_SUBTAGS,
} from "./locale-select.js";

export {
    LocaleSelect,
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
    defaultLocaleLabels,
    RTL_LANGUAGE_TAGS,
    RTL_SCRIPT_SUBTAGS,
};
export type { LocaleSelectProps, LocaleSelectChangeDetail } from "./locale-select.js";

if (typeof customElements !== "undefined" && !customElements.get("locale-select")) {
    customElements.define("locale-select", LocaleSelect);
}
