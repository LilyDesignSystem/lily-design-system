import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  model,
  output,
} from "@angular/core";

import {
  defaultLocaleLabels,
  RTL_LANGUAGE_TAGS,
  RTL_SCRIPT_SUBTAGS,
} from "./locales";

// ---------------------------------------------------------------
// Pure helpers (exported so consumers can reuse them)
// ---------------------------------------------------------------

/** Convert a locale code to its BCP 47 hyphen form. */
export function bcp47LocaleTag(locale: string): string {
  return locale.replace(/_/g, "-");
}

/** Detect whether a locale is right-to-left. See spec/index.md §5.6. */
export function isRtlLocale(locale: string): boolean {
  if (!locale) return false;
  const parts = locale.split(/[-_]/);
  for (const part of parts) {
    if (RTL_SCRIPT_SUBTAGS.has(part.toLowerCase())) return true;
  }
  const base = parts[0]?.toLowerCase() ?? "";
  return RTL_LANGUAGE_TAGS.has(base);
}

/** Resolve a locale code to its English name via the built-in table. */
export function localeName(locale: string): string {
  return defaultLocaleLabels[locale] ?? locale;
}

/** Opportunistic Intl.DisplayNames lookup; never throws. */
function intlDisplayName(locale: string): string {
  try {
    const env =
      typeof navigator !== "undefined" && navigator.language
        ? navigator.language
        : "en";
    const dn = new Intl.DisplayNames([env], { type: "language" });
    return dn.of(bcp47LocaleTag(locale)) ?? "";
  } catch {
    return "";
  }
}

/** Match a navigator preference against a supported-locales list. */
export function matchNavigatorLanguage(
  navLangs: readonly string[],
  locales: readonly string[],
): string {
  const lc = (s: string) => s.toLowerCase().replace(/_/g, "-");
  const localesLc = locales.map(lc);
  for (const raw of navLangs) {
    const nav = lc(raw);

    // 1. Exact match (treating - and _ as equivalent).
    const exactIndex = localesLc.indexOf(nav);
    if (exactIndex !== -1) return locales[exactIndex];

    // 2. Language-only match.
    const navBase = nav.split("-")[0];
    for (let i = 0; i < locales.length; i++) {
      const base = localesLc[i].split("-")[0];
      if (base === navBase) return locales[i];
    }
  }
  return "";
}

/**
 * LocaleSelect — `lang` + `dir` locale select.
 *
 * Renders an accessible native `<select>` of locales. On every locale
 * change the select writes `lang` (and, by default, `dir`) to the
 * document root or a consumer-supplied target. See `spec/index.md` for the
 * full contract.
 */
@Component({
  selector: "lily-locale-select",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <select
      class="locale-select {{ className() }}"
      [attr.aria-label]="label() || null"
      [name]="name()"
      (change)="onInputChange($any($event.target).value)"
    >
      @for (locale of locales(); track locale) {
        <option
          class="locale-select-option"
          [attr.lang]="tagFor(locale)"
          [value]="locale"
          [selected]="value() === locale"
        >{{ labelFor(locale) }}</option>
      }
    </select>
  `,
})
export class LocaleSelect {
  readonly label = input.required<string>();
  readonly locales = input.required<string[]>();
  readonly value = model<string>("");
  readonly defaultValue = input<string>("");
  readonly storageKey = input<string>("");
  readonly detectFromNavigator = input<boolean>(false);
  readonly name = input<string>("locale");
  readonly target = input<HTMLElement | null>(null);
  readonly applyDir = input<boolean>(true);
  readonly localeLabels = input<Record<string, string>>({});
  readonly className = input<string>("");
  readonly localeChange = output<string>();

  private initialised = false;

  constructor() {
    effect(() => {
      const current = this.value();

      if (!this.initialised) {
        this.initialised = true;
        let initial = current;

        const sk = this.storageKey();
        if (!initial && sk) {
          try {
            initial = (typeof localStorage !== "undefined"
              ? localStorage.getItem(sk)
              : null) ?? "";
          } catch {
            // ignore privacy errors
          }
        }

        if (!initial && this.detectFromNavigator() && typeof navigator !== "undefined") {
          const navLangs =
            navigator.languages && navigator.languages.length > 0
              ? Array.from(navigator.languages)
              : navigator.language
                ? [navigator.language]
                : [];
          initial = matchNavigatorLanguage(navLangs, this.locales());
        }

        if (!initial) {
          const locales = this.locales();
          const dv = this.defaultValue();
          initial =
            dv ||
            (locales.includes("en") ? "en" : locales[0]) ||
            "";
        }

        if (initial && initial !== current) {
          this.value.set(initial);
          return;
        }
      }

      if (current) this.applyLocale(current);
    });
  }

  labelFor(locale: string): string {
    const labels = this.localeLabels();
    if (locale in labels) return labels[locale];
    if (locale in defaultLocaleLabels) return defaultLocaleLabels[locale];
    const intl = intlDisplayName(locale);
    if (intl) return intl;
    return locale;
  }

  tagFor(locale: string): string {
    return bcp47LocaleTag(locale);
  }

  onInputChange(next: string): void {
    this.value.set(next);
  }

  private applyLocale(code: string): void {
    if (typeof document === "undefined" || !code) return;
    const root = this.target() ?? document.documentElement;
    root.setAttribute("lang", bcp47LocaleTag(code));
    if (this.applyDir()) {
      root.setAttribute("dir", isRtlLocale(code) ? "rtl" : "ltr");
    }

    const sk = this.storageKey();
    if (sk) {
      try {
        localStorage.setItem(sk, code);
      } catch {
        // ignore quota / privacy errors
      }
    }
    this.localeChange.emit(code);
  }
}
