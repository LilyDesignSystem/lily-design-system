/**
 * Barrel re-export for `<locale-chooser>`.
 *
 * Importing this module registers the custom element under the tag
 * name `"locale-chooser"`. Registration is idempotent — re-imports do
 * not throw. Consumers who want a different tag name can import the
 * class directly from `./locale-chooser` and call
 * `customElements.define(...)` themselves.
 */

import {
    LocaleChooser,
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
    defaultLocaleLabels,
    RTL_LANGUAGE_TAGS,
    RTL_SCRIPT_SUBTAGS,
    nextLocaleChooserId,
    GLOBE_WITH_MERIDIANS,
} from "./locale-chooser.js";

export {
    LocaleChooser,
    bcp47LocaleTag,
    isRtlLocale,
    localeName,
    matchNavigatorLanguage,
    defaultLocaleLabels,
    RTL_LANGUAGE_TAGS,
    RTL_SCRIPT_SUBTAGS,
    nextLocaleChooserId,
    GLOBE_WITH_MERIDIANS,
};
export type { LocaleChooserProps, LocaleChooserChangeDetail } from "./locale-chooser.js";

if (typeof customElements !== "undefined" && !customElements.get("locale-chooser")) {
    customElements.define("locale-chooser", LocaleChooser);
}
