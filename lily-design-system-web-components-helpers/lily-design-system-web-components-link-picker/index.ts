/**
 * Barrel re-export for `<lily-link-picker>`.
 *
 * Importing this module registers the custom element under the tag
 * name `"lily-link-picker"`. Registration is idempotent — re-imports do
 * not throw. Consumers who want a different tag name can import the
 * class directly from `./link-picker` and call
 * `customElements.define(...)` themselves.
 */

import { LinkPicker, linkId, nextLinkPickerId } from "./link-picker.js";
export { LinkPicker, linkId, nextLinkPickerId };
export type { LinkItem, LinkPickerProps, LinkPickerNavigateDetail } from "./link-picker.js";

if (typeof customElements !== "undefined" && !customElements.get("lily-link-picker")) {
    customElements.define("lily-link-picker", LinkPicker);
}
