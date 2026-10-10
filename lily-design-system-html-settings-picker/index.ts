/**
 * Barrel re-export for `<settings-picker>`.
 *
 * Importing this module registers the custom element under the tag
 * name `"settings-picker"`. Registration is idempotent — re-imports do
 * not throw. Consumers who want a different tag name can import the
 * class directly from `./settings-picker` and call
 * `customElements.define(...)` themselves.
 */

import { SettingsPicker, nextSettingsPickerId, FOCUSABLE } from "./settings-picker.js";
export { SettingsPicker, nextSettingsPickerId, FOCUSABLE };
export type { SettingsPickerProps, SettingsPickerOpenChangeDetail } from "./settings-picker.js";

if (typeof customElements !== "undefined" && !customElements.get("settings-picker")) {
    customElements.define("settings-picker", SettingsPicker);
}
