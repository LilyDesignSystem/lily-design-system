/**
 * Barrel re-export for `<picker-bar>`.
 *
 * Importing this module registers the custom element under the tag
 * name `"picker-bar"` — and, as a side effect, registers the four
 * wrapped elements (`theme-picker`, `locale-picker`, `text-size-picker`,
 * `share-picker`) too, since it imports each of their own packages.
 * Registration is idempotent — re-imports do not throw.
 */

import { PickerBar, DEFAULT_THEMES, DEFAULT_SIZES } from "./picker-bar.js";

export { PickerBar, DEFAULT_THEMES, DEFAULT_SIZES };
export type {
  PickerBarProps,
  PickerBarLabels,
  ThemePickerExtra,
  LocalePickerExtra,
  TextSizePickerExtra,
  SharePickerExtra,
  ShareTarget,
} from "./picker-bar.js";

if (typeof customElements !== "undefined" && !customElements.get("picker-bar")) {
  customElements.define("picker-bar", PickerBar);
}
