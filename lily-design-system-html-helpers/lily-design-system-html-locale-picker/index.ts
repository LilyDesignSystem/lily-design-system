/**
 * Barrel re-export for `<locale-picker>`.
 *
 * Importing this module registers the custom element under the tag
 * name `"locale-picker"`. Registration is idempotent — re-imports do
 * not throw. Consumers who want a different tag name can import the
 * class directly from `./locale-picker` and call
 * `customElements.define(...)` themselves.
 */

import {
    LocalePicker,
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
    defaultLocaleLabels,
    RTL_LANGUAGE_TAGS,
    RTL_SCRIPT_SUBTAGS,
} from "./locale-picker.js";

export {
    LocalePicker,
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
    defaultLocaleLabels,
    RTL_LANGUAGE_TAGS,
    RTL_SCRIPT_SUBTAGS,
};
export type { LocalePickerProps, LocalePickerChangeDetail } from "./locale-picker.js";

if (typeof customElements !== "undefined" && !customElements.get("locale-picker")) {
    customElements.define("locale-picker", LocalePicker);
}
