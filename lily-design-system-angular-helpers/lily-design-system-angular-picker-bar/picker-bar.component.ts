import { ChangeDetectionStrategy, Component, input, model, output } from "@angular/core";

import { ThemePicker } from "@lilydesignsystem/angular-theme-picker";
import { LocalePicker } from "@lilydesignsystem/angular-locale-picker";
import { TextSizePicker } from "@lilydesignsystem/angular-text-size-picker";
import {
  SharePicker,
  type ShareEvent,
  type ShareStrategy,
  type ShareTarget,
} from "@lilydesignsystem/angular-share-picker";

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

/**
 * PickerBar — composes theme-picker, locale-picker, text-size-picker,
 * and share-picker into one page-header row.
 *
 * A thin wrapper: it renders the four picker components, each imported
 * as a real npm dependency from its own published package, unmodified.
 * It pre-wires two catalog-specific defaults (`DEFAULT_THEMES`,
 * `DEFAULT_SIZES`) and flattens each wrapped picker's most commonly
 * needed optional props onto its own inputs — Angular has no spread
 * binding for component inputs, so unlike the canonical Svelte
 * contract's `*Props` bag, overrides here are named inputs rather than
 * an object spread. `motion-picker` and `date-time-picker` are
 * deliberately not included — see `spec/index.md` §1.
 */
@Component({
  selector: "lily-picker-bar",
  standalone: true,
  imports: [ThemePicker, LocalePicker, TextSizePicker, SharePicker],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="picker-bar {{ className() }}">
      <lily-theme-picker
        [label]="labels().theme"
        [themesUrl]="themesUrl()"
        [themes]="themes()"
        [(value)]="themeValue"
        [defaultValue]="themeDefaultValue()"
        [storageKey]="themeStorageKey()"
        [detectFromSystem]="themeDetectFromSystem()"
        [name]="themeName()"
        [target]="themeTarget()"
        [themeLabels]="themeLabels()"
      />
      <lily-locale-picker
        [label]="labels().locale"
        [locales]="locales()"
        [(value)]="localeValue"
        [defaultValue]="localeDefaultValue()"
        [storageKey]="localeStorageKey()"
        [detectFromNavigator]="localeDetectFromNavigator()"
        [name]="localeName()"
        [target]="localeTarget()"
        [applyDir]="localeApplyDir()"
        [localeLabels]="localeLabels()"
      />
      <lily-text-size-picker
        [label]="labels().textSize"
        [sizes]="sizes()"
        [(value)]="textSizeValue"
        [defaultValue]="textSizeDefaultValue()"
        [storageKey]="textSizeStorageKey()"
        [name]="textSizeName()"
        [target]="textSizeTarget()"
        [sizeLabels]="textSizeLabels()"
      />
      <lily-share-picker
        [label]="labels().share"
        [targets]="shareTargets()"
        [url]="shareUrl()"
        [title]="shareTitle()"
        [text]="shareText()"
        [copyLabel]="copyLabel()"
        [copiedLabel]="copiedLabel()"
        [copyFailedLabel]="copyFailedLabel()"
        [strategy]="shareStrategy()"
        (share)="share.emit($event)"
        (copy)="copy.emit($event)"
        (nativeShare)="nativeShare.emit($event)"
      />
    </div>
  `,
})
export class PickerBar {
  /** Accessible names for each picker. */
  readonly labels = input.required<PickerBarLabels>();

  // --- theme-picker ---
  /** Base URL of the themes directory, forwarded to ThemePicker. */
  readonly themesUrl = input.required<string>();
  /** Available theme slugs. Defaults to {@link DEFAULT_THEMES}. */
  readonly themes = input<string[]>(DEFAULT_THEMES);
  /** Two-way bindable current theme slug. */
  readonly themeValue = model<string>("");
  readonly themeDefaultValue = input<string>("");
  readonly themeStorageKey = input<string>("");
  readonly themeDetectFromSystem = input<boolean>(false);
  readonly themeName = input<string>("theme");
  readonly themeTarget = input<HTMLElement | null>(null);
  readonly themeLabels = input<Record<string, string>>({});

  // --- locale-picker ---
  /** Available locale codes. No catalog default exists — supply the set you support. */
  readonly locales = input.required<string[]>();
  /** Two-way bindable current locale code. */
  readonly localeValue = model<string>("");
  readonly localeDefaultValue = input<string>("");
  readonly localeStorageKey = input<string>("");
  readonly localeDetectFromNavigator = input<boolean>(false);
  readonly localeName = input<string>("locale");
  readonly localeTarget = input<HTMLElement | null>(null);
  readonly localeApplyDir = input<boolean>(true);
  readonly localeLabels = input<Record<string, string>>({});

  // --- text-size-picker ---
  /** Available size slugs. Defaults to {@link DEFAULT_SIZES}. */
  readonly sizes = input<string[]>(DEFAULT_SIZES);
  /** Two-way bindable current size slug. */
  readonly textSizeValue = model<string>("");
  /**
   * `text-size-picker`'s own fallback ("medium", else `sizes[0]`) does
   * not fit the seven-slug scale — "medium" is not one of the seven,
   * and `sizes[0]` would silently start every consumer on "Largest".
   */
  readonly textSizeDefaultValue = input<string>("normal");
  readonly textSizeStorageKey = input<string>("");
  readonly textSizeName = input<string>("text-size");
  readonly textSizeTarget = input<HTMLElement | null>(null);
  readonly textSizeLabels = input<Record<string, string>>({});

  // --- share-picker ---
  /** Destinations offered by the share picker. Empty is valid if `copyLabel` is set. */
  readonly shareTargets = input<ShareTarget[]>([]);
  readonly shareUrl = input<string>("");
  readonly shareTitle = input<string>("");
  readonly shareText = input<string>("");
  readonly copyLabel = input<string>("");
  readonly copiedLabel = input<string>("");
  readonly copyFailedLabel = input<string>("");
  readonly shareStrategy = input<ShareStrategy>("auto");
  /** Fires after a share destination is chosen. */
  readonly share = output<ShareEvent>();
  /** Fires after the URL is copied. */
  readonly copy = output<string>();
  /** Fires when the native share sheet was used instead of the list. */
  readonly nativeShare = output<string>();

  /** Extra CSS class on the root. */
  readonly className = input<string>("");
}
