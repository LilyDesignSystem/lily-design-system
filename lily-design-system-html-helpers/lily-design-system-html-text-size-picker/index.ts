/**
 * Barrel re-export for `<text-size-picker>`.
 *
 * Importing this module registers the custom element under the tag
 * name `"text-size-picker"`. Registration is idempotent — re-imports
 * do not throw. Consumers who want a different tag name can import the
 * class directly from `./text-size-picker` and call
 * `customElements.define(...)` themselves.
 */

import {
    TextSizePicker,
    sizeName,
    nextTextSizePickerId,
    LATIN_CAPITAL_LETTER_A,
} from "./text-size-picker.js";

export { TextSizePicker, sizeName, nextTextSizePickerId, LATIN_CAPITAL_LETTER_A };
export type {
    TextSizePickerProps,
    TextSizePickerChangeDetail,
} from "./text-size-picker.js";

if (
    typeof customElements !== "undefined" &&
    !customElements.get("text-size-picker")
) {
    customElements.define("text-size-picker", TextSizePicker);
}
