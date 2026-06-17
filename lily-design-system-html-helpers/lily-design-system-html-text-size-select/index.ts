/**
 * Barrel re-export for `<text-size-select>`.
 *
 * Importing this module registers the custom element under the tag
 * name `"text-size-select"`. Registration is idempotent — re-imports
 * do not throw. Consumers who want a different tag name can import the
 * class directly from `./text-size-select` and call
 * `customElements.define(...)` themselves.
 */

import { TextSizeSelect } from "./text-size-select.js";

export { TextSizeSelect };
export type {
    TextSizeSelectProps,
    TextSizeSelectChangeDetail,
} from "./text-size-select.js";

if (
    typeof customElements !== "undefined" &&
    !customElements.get("text-size-select")
) {
    customElements.define("text-size-select", TextSizeSelect);
}
