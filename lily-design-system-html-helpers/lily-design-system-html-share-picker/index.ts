/**
 * Barrel re-export for `<share-picker>`.
 *
 * Importing this module registers the custom element under the tag
 * name `"share-picker"`. Registration is idempotent — re-imports do
 * not throw. Consumers who want a different tag name can import the
 * class directly from `./share-picker` and call
 * `customElements.define(...)` themselves.
 */

import {
    SharePicker,
    canShareNatively,
    canCopy,
    nextSharePickerId,
    BLACK_RIGHTWARDS_ARROWHEAD,
} from "./share-picker.js";
export {
    SharePicker,
    canShareNatively,
    canCopy,
    nextSharePickerId,
    BLACK_RIGHTWARDS_ARROWHEAD,
};
export type {
    SharePickerProps,
    SharePickerShareDetail,
    SharePickerUrlDetail,
    ShareTarget,
    ShareStrategy,
} from "./share-picker.js";

if (typeof customElements !== "undefined" && !customElements.get("share-picker")) {
    customElements.define("share-picker", SharePicker);
}
