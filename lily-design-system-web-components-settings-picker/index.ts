/**
 * Barrel re-export for `<lily-settings-picker>`.
 *
 * Importing this module registers the custom element under the tag
 * name `"lily-settings-picker"`. Registration is idempotent — re-imports do
 * not throw. Consumers who want a different tag name can import the
 * class directly from `./settings-picker` and call
 * `customElements.define(...)` themselves.
 */

import { SettingsPicker, nextSettingsPickerId, FOCUSABLE } from "./settings-picker.js";
export { SettingsPicker, nextSettingsPickerId, FOCUSABLE };
export type { SettingsPickerProps, SettingsPickerOpenChangeDetail } from "./settings-picker.js";

if (typeof customElements !== "undefined" && !customElements.get("lily-settings-picker")) {
    customElements.define("lily-settings-picker", SettingsPicker);
}
