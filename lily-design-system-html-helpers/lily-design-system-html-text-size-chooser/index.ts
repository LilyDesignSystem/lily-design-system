/**
 * Barrel re-export for `<text-size-chooser>`.
 *
 * Importing this module registers the custom element under the tag
 * name `"text-size-chooser"`. Registration is idempotent — re-imports
 * do not throw. Consumers who want a different tag name can import the
 * class directly from `./text-size-chooser` and call
 * `customElements.define(...)` themselves.
 */

import {
    TextSizeChooser,
    sizeName,
    nextTextSizeChooserId,
    LATIN_CAPITAL_LETTER_A,
} from "./text-size-chooser.js";

export { TextSizeChooser, sizeName, nextTextSizeChooserId, LATIN_CAPITAL_LETTER_A };
export type {
    TextSizeChooserProps,
    TextSizeChooserChangeDetail,
} from "./text-size-chooser.js";

if (
    typeof customElements !== "undefined" &&
    !customElements.get("text-size-chooser")
) {
    customElements.define("text-size-chooser", TextSizeChooser);
}
