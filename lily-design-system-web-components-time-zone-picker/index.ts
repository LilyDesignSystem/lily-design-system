/**
 * Barrel re-export for `<lily-time-zone-picker>`.
 *
 * Importing this module registers the custom element under the tag
 * name `"lily-time-zone-picker"`. Registration is idempotent — re-imports
 * do not throw. Consumers who want a different tag name can import the
 * class directly from `./time-zone-picker` and call
 * `customElements.define(...)` themselves.
 */

import { TimeZonePicker, DEFAULT_ZONES, nextTimeZonePickerId } from "./time-zone-picker.js";

export { TimeZonePicker, DEFAULT_ZONES, nextTimeZonePickerId };
export type { TimeZonePickerProps, TimeZonePickerChangeDetail, ZoneInfo } from "./time-zone-picker.js";
export { formatOffset, matchZone, offsetMinutes, orderedZones, systemZone, zoneInfo, zoneName, defaultLabel } from "./zones.js";

if (typeof customElements !== "undefined" && !customElements.get("lily-time-zone-picker")) {
    customElements.define("lily-time-zone-picker", TimeZonePicker);
}
