/**
 * Barrel re-export for `<motion-picker>`.
 *
 * Importing this module registers the custom element under the tag
 * name `"motion-picker"`. Registration is idempotent — re-imports
 * do not throw. Consumers who want a different tag name can import the
 * class directly from `./motion-picker` and call
 * `customElements.define(...)` themselves.
 */

import {
    MotionPicker,
    motionName,
    prefersReducedMotion,
    nextMotionPickerId,
    PAUSE_SIGN,
} from "./motion-picker.js";

export { MotionPicker, motionName, prefersReducedMotion, nextMotionPickerId, PAUSE_SIGN };
export type {
    MotionPickerProps,
    MotionPickerChangeDetail,
} from "./motion-picker.js";

if (
    typeof customElements !== "undefined" &&
    !customElements.get("motion-picker")
) {
    customElements.define("motion-picker", MotionPicker);
}
