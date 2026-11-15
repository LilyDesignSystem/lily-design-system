/**
 * Barrel re-export for `<color-picker>`.
 *
 * Importing this module registers the custom element under the tag name
 * `"color-picker"`. Registration is idempotent. To use another tag name,
 * import the class from `./color-picker` and call `customElements.define`.
 */
import { ColorPicker, nextColorPickerId } from "./color-picker.js";
export { ColorPicker, nextColorPickerId };
export type { Labels } from "./color-picker.js";
export {
    CSS_NAMED_COLORS,
    TRANSPARENT,
    cmykToHex,
    cmykToRgb,
    defaultPalette,
    hexToCmyk,
    hexToHsb,
    hexToHsl,
    hexToRgb,
    hsbToHex,
    hsbToRgb,
    hslToHex,
    hslToRgb,
    nameOfColor,
    normalizeHex,
    parseColor,
    pushRecent,
    rgbToCmyk,
    rgbToHex,
    rgbToHsb,
    rgbToHsl,
} from "./colors.js";
export type { Cmyk, Hsb, Hsl, Rgb } from "./colors.js";

if (typeof customElements !== "undefined" && !customElements.get("color-picker")) {
    customElements.define("color-picker", ColorPicker);
}
