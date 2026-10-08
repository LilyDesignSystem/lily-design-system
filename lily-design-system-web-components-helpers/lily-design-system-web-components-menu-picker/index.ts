/**
 * Barrel re-export for `<lily-menu-picker>`.
 *
 * Importing this module registers the custom element under the tag
 * name `"lily-menu-picker"`. Registration is idempotent — re-imports do
 * not throw. Consumers who want a different tag name can import the
 * class directly from `./menu-picker` and call
 * `customElements.define(...)` themselves.
 */

import { MenuPicker, nextMenuPickerId, FOCUSABLE } from "./menu-picker.js";
export { MenuPicker, nextMenuPickerId, FOCUSABLE };
export type { MenuPickerProps, MenuPickerOpenChangeDetail } from "./menu-picker.js";

if (typeof customElements !== "undefined" && !customElements.get("lily-menu-picker")) {
    customElements.define("lily-menu-picker", MenuPicker);
}
