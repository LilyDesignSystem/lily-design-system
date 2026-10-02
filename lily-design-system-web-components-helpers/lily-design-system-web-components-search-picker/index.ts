/**
 * Barrel re-export for `<lily-search-picker>`.
 *
 * Importing this module registers the custom element under the tag
 * name `"lily-search-picker"`. Registration is idempotent — re-imports do
 * not throw. Consumers who want a different tag name can import the
 * class directly from `./search-picker` and call
 * `customElements.define(...)` themselves.
 */

import {
    SearchPicker,
    RETURN_SYMBOL,
    searchHref,
    nextSearchPickerId,
} from "./search-picker.js";
export { SearchPicker, RETURN_SYMBOL, searchHref, nextSearchPickerId };
export type {
    SearchPickerProps,
    SearchPickerSearchDetail,
} from "./search-picker.js";

if (typeof customElements !== "undefined" && !customElements.get("lily-search-picker")) {
    customElements.define("lily-search-picker", SearchPicker);
}
