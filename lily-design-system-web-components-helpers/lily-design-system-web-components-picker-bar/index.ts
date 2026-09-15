/**
 * Barrel re-export for `<lily-picker-bar>`.
 *
 * Importing this module registers the custom element under the tag
 * name `"lily-picker-bar"`, and — because it statically imports the
 * four wrapped pickers' own barrels — registers `lily-theme-picker`,
 * `lily-locale-picker`, `lily-text-size-picker`, and `lily-share-picker`
 * too, if they are not already registered. Registration is idempotent
 * — re-imports do not throw.
 */

import { PickerBar, DEFAULT_THEMES, DEFAULT_SIZES } from "./picker-bar.js";
export { PickerBar, DEFAULT_THEMES, DEFAULT_SIZES };
export type { PickerBarProps, PickerBarLabels } from "./picker-bar.js";

if (
    typeof customElements !== "undefined" &&
    !customElements.get("lily-picker-bar")
) {
    customElements.define("lily-picker-bar", PickerBar);
}
