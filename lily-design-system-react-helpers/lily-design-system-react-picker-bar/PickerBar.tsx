import * as React from "react";

import ThemePicker, {
  type Props as ThemePickerProps,
} from "lily-design-system-react-theme-picker";
import LocalePicker, {
  type Props as LocalePickerProps,
} from "lily-design-system-react-locale-picker";
import TextSizePicker, {
  type Props as TextSizePickerProps,
} from "lily-design-system-react-text-size-picker";
import SharePicker, {
  type Props as SharePickerProps,
  type ShareTarget,
} from "lily-design-system-react-share-picker";

/**
 * All 45 Lily reference theme slugs (see `themes/` at the repo root),
 * sorted alphabetically except the United Kingdom and United States
 * government/public-sector themes, which sort last as one alphabetical
 * group of their own. Mirrors `theme-picker`'s own title-casing of each
 * slug, so no `themeLabels` override is needed for these to read well.
 */
export const DEFAULT_THEMES: string[] = [
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

/**
 * The seven-step text-size scale. Each slug title-cases to exactly the
 * requested label ("largest" → "Largest", …) via `text-size-picker`'s
 * own default `labelFor`, so no `sizeLabels` override is needed either.
 */
export const DEFAULT_SIZES: string[] = [
  "largest",
  "larger",
  "large",
  "normal",
  "small",
  "smaller",
  "smallest",
];

/** Accessible names for the four pickers. Required — no English default. */
export type PickerBarLabels = {
  /** Accessible name for the theme picker's button and listbox. */
  theme: string;
  /** Accessible name for the locale picker's button and listbox. */
  locale: string;
  /** Accessible name for the text-size picker's button and listbox. */
  textSize: string;
  /** Accessible name for the share picker's button and list. */
  share: string;
};

/** Public props for PickerBar. See `spec/index.md` §4 for the contract. */
export type Props = Omit<React.HTMLAttributes<HTMLDivElement>, "children"> & {
  /** Accessible names for each picker. */
  labels: PickerBarLabels;

  /** Base URL of the themes directory, forwarded to ThemePicker. */
  themesUrl: string;
  /** Available theme slugs. Defaults to {@link DEFAULT_THEMES}. */
  themes?: string[];
  /** Extra ThemePicker props, spread after this bar's own. */
  themeProps?: Partial<Omit<ThemePickerProps, "themesUrl" | "themes">>;

  /** Available locale codes. No catalog default exists — supply the set you support. */
  locales: string[];
  /** Extra LocalePicker props, spread after this bar's own. */
  localeProps?: Partial<Omit<LocalePickerProps, "locales">>;

  /** Available size slugs. Defaults to {@link DEFAULT_SIZES}. */
  sizes?: string[];
  /** Extra TextSizePicker props, spread after this bar's own. */
  textSizeProps?: Partial<Omit<TextSizePickerProps, "sizes">>;

  /** Destinations offered by the share picker. Empty is valid if `shareProps.copyLabel` is set. */
  shareTargets?: ShareTarget[];
  /** Extra SharePicker props, spread after this bar's own. */
  shareProps?: Partial<Omit<SharePickerProps, "targets">>;

  /** Extra CSS class on the root. */
  className?: string;
};

export function PickerBar({
  labels,
  themesUrl,
  themes = DEFAULT_THEMES,
  themeProps = {},
  locales,
  localeProps = {},
  sizes = DEFAULT_SIZES,
  textSizeProps = {},
  shareTargets = [],
  shareProps = {},
  className = "",
  ...restProps
}: Props): React.ReactElement {
  return (
    <div className={`picker-bar ${className}`.trim()} {...restProps}>
      <ThemePicker
        label={labels.theme}
        themesUrl={themesUrl}
        themes={themes}
        {...themeProps}
      />
      <LocalePicker label={labels.locale} locales={locales} {...localeProps} />
      <TextSizePicker
        label={labels.textSize}
        sizes={sizes}
        defaultValue="normal"
        {...textSizeProps}
      />
      <SharePicker
        label={labels.share}
        targets={shareTargets}
        {...shareProps}
      />
    </div>
  );
}

export default PickerBar;
