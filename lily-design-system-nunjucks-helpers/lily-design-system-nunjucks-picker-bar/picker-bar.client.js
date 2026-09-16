// PickerBar client-side runtime.
//
// Pairs with picker-bar.njk. Unlike every other helper in this catalog,
// this module owns NO lifecycle of its own: theme-picker.client.js,
// locale-picker.client.js, text-size-picker.client.js, and
// share-picker.client.js already own theirs, in full, independently of
// nesting (each scans the document for its own `data-lily-*-picker-root`
// hook). This module is a convenience wrapper that wires all four at
// once, scoped to one `picker-bar` root, instead of requiring the
// consumer to call four separate `init*Picker` functions.
//
// See spec/index.md §4.3 (client.js exports), §5 (behaviour).

import {
  initThemePicker,
  autoInit as autoInitThemePicker,
} from "@lilydesignsystem/nunjucks-theme-picker";
import {
  initLocalePicker,
  autoInit as autoInitLocalePicker,
} from "@lilydesignsystem/nunjucks-locale-picker";
import {
  initTextSizePicker,
  autoInit as autoInitTextSizePicker,
} from "@lilydesignsystem/nunjucks-text-size-picker";
import {
  initSharePicker,
  autoInit as autoInitSharePicker,
} from "@lilydesignsystem/nunjucks-share-picker";

/**
 * All 45 Lily reference theme slugs, in the same order as
 * `DEFAULT_THEMES` in picker-bar.njk. A Nunjucks macro cannot import a
 * JS constant, so the two copies are held in agreement by a test
 * rather than by delegation — the same pattern this catalog already
 * uses for `themeName`/`sizeName` (macro template syntax vs. client.js
 * function).
 */
export const DEFAULT_THEMES = [
  "abyss",
  "acid",
  "adobe-spectrum",
  "aqua",
  "autumn",
  "black",
  "bumblebee",
  "business",
  "caramellatte",
  "cmyk",
  "coffee",
  "corporate",
  "cupcake",
  "cyberpunk",
  "dark",
  "dim",
  "dracula",
  "emerald",
  "fantasy",
  "forest",
  "garden",
  "halloween",
  "lemonade",
  "light",
  "lofi",
  "luxury",
  "mozilla-protocol",
  "night",
  "nord",
  "pastel",
  "retro",
  "silk",
  "sunset",
  "synthwave",
  "valentine",
  "winter",
  "wireframe",
  "united-kingdom-government-digital-service",
  "united-kingdom-national-health-service-england-for-patients",
  "united-kingdom-national-health-service-england-for-practitioners",
  "united-kingdom-national-health-service-scotland-for-patients",
  "united-kingdom-national-health-service-scotland-for-practitioners",
  "united-kingdom-national-health-service-wales-for-patients",
  "united-kingdom-national-health-service-wales-for-practitioners",
  "united-states-web-design-system",
];

/** The seven-step text-size scale, largest first. */
export const DEFAULT_SIZES = [
  "largest",
  "larger",
  "large",
  "normal",
  "small",
  "smaller",
  "smallest",
];

/**
 * Wire the four pickers inside one `[data-lily-picker-bar-root]`
 * element. Each nested picker root is found and handed to its own
 * sibling package's `init*Picker(root, opts)` — no different from
 * calling all four by hand, just in one call.
 *
 * @param {HTMLElement} root
 * @param {{themeProps?: object, localeProps?: object, textSizeProps?: object, shareProps?: object}=} opts
 */
export function initPickerBar(root, opts = {}) {
  if (!root) {
    return { theme: null, locale: null, textSize: null, share: null };
  }
  const {
    themeProps = {},
    localeProps = {},
    textSizeProps = {},
    shareProps = {},
  } = opts;

  const themeRoot = root.querySelector("[data-lily-theme-picker-root]");
  const localeRoot = root.querySelector("[data-lily-locale-picker-root]");
  const textSizeRoot = root.querySelector(
    "[data-lily-text-size-picker-root]",
  );
  const shareRoot = root.querySelector("[data-lily-share-picker-root]");

  return {
    theme: themeRoot ? initThemePicker(themeRoot, themeProps) : null,
    locale: localeRoot ? initLocalePicker(localeRoot, localeProps) : null,
    textSize: textSizeRoot
      ? initTextSizePicker(textSizeRoot, textSizeProps)
      : null,
    share: shareRoot ? initSharePicker(shareRoot, shareProps) : null,
  };
}

/**
 * Find every `[data-lily-picker-bar-root]` and wire it.
 *
 * @param {{themeProps?: object, localeProps?: object, textSizeProps?: object, shareProps?: object}=} opts
 * @returns {Array<ReturnType<typeof initPickerBar>>}
 */
export function autoInit(opts = {}) {
  if (typeof document === "undefined") return [];
  const roots = Array.from(
    document.querySelectorAll("[data-lily-picker-bar-root]"),
  );
  return roots.map((root) => initPickerBar(root, opts));
}

// Re-exported so a consumer who only loaded picker-bar.client.js can
// still reach the four siblings' own page-wide autoInit directly, e.g.
// when a page also has a standalone theme-picker outside any bar.
export {
  autoInitThemePicker,
  autoInitLocalePicker,
  autoInitTextSizePicker,
  autoInitSharePicker,
};
