/**
 * Barrel re-export for `<link-picker>`.
 *
 * Importing this module registers the custom element under the tag
 * name `"link-picker"`. Registration is idempotent — re-imports do
 * not throw. Consumers who want a different tag name can import the
 * class directly from `./link-picker` and call
 * `customElements.define(...)` themselves.
 */

import { LinkPicker, linkId, nextLinkPickerId } from "./link-picker.js";
export { LinkPicker, linkId, nextLinkPickerId };
export type { LinkItem, LinkPickerProps, LinkPickerNavigateDetail } from "./link-picker.js";

if (typeof customElements !== "undefined" && !customElements.get("link-picker")) {
    customElements.define("link-picker", LinkPicker);
}
