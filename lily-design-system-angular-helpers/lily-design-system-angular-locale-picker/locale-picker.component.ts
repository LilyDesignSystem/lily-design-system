import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  TemplateRef,
  computed,
  contentChild,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from "@angular/core";
import { IconButton, Listbox } from "@lilydesignsystem/angular-headless";

import {
  defaultLocaleLabels,
  RTL_LANGUAGE_TAGS,
  RTL_SCRIPT_SUBTAGS,
} from "./locales";

/**
 * Default button icon: a bundled SVG (globe outline), not a Unicode
 * character. Reversed 2026-09-16 from the font-dependent-glyph
 * convention (was U+1F310 GLOBE WITH MERIDIANS + U+FE0E, exported as
 * `GLOBE_WITH_MERIDIANS` — removed, not renamed). The old glyph needed
 * VS15 to force text presentation and still risked the colour-emoji
 * font on stacks that ignore the selector; a bundled outline SVG has
 * no such risk and stays monochrome alongside theme-picker's icon on
 * every platform.
 */

/** Context passed to a custom icon `<ng-template>` (the button icon). */
export type ChildArgs = {
  /** Currently selected locale code (consumer form, not BCP 47-normalised). */
  value: string;
  /** Is the listbox open? */
  open: boolean;
  /** Resolve a locale code to its display label. */
  labelFor: (locale: string) => string;
};

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

/**
 * The language's own name for itself — "de" → "Deutsch", "cy" →
 * "Cymraeg" — from `Intl.DisplayNames` asked *in that language*.
 *
 * Endonyms are the right default for a language menu: the user who
 * needs it most is the one lost in a UI that is not in their
 * language, and they recognise "Cymraeg" where "Welsh" means
 * nothing to them. Deterministic (no `navigator` dependency), so
 * the server and the client render the same label. Returns "" when
 * the runtime has no data — some runtimes echo the tag back instead
 * of failing, and an echo is not a name.
 */
export function localeEndonym(locale: string): string {
  try {
    const tag = bcp47LocaleTag(locale);
    const dn = new Intl.DisplayNames([tag], { type: "language" });
    const found = dn.of(tag) ?? "";
    return found && found.toLowerCase() !== tag.toLowerCase() ? found : "";
  } catch {
    return "";
  }
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

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextLocalePickerId(): string {
  uid += 1;
  return `locale-picker-${uid}`;
}

/**
 * Optional marker for the projected icon template. Gives consumers typed
 * `let-` variables:
 *
 * ```html
 * <lily-locale-picker ...>
 *   <ng-template lilyLocalePickerIcon let-args>{{ args.labelFor(args.value) }}</ng-template>
 * </lily-locale-picker>
 * ```
 *
 * The component queries any projected `<ng-template>`, so the marker is
 * for type-checking and readability, not for matching.
 */
@Directive({
  selector: "ng-template[lilyLocalePickerIcon]",
  standalone: true,
})
export class LocalePickerIcon {
  static ngTemplateContextGuard(
    _dir: LocalePickerIcon,
    _ctx: unknown,
  ): _ctx is ChildArgs & { $implicit: ChildArgs } {
    return true;
  }
}

/**
 * LocalePicker — `lang` + `dir` locale picker.
 *
 * Renders an icon button that opens a WAI-ARIA APG listbox of locales. On
 * every locale change the component writes `lang` (and, by default, `dir`)
 * to the document root or a consumer-supplied target. See `spec/index.md`
 * for the full contract.
 */
@Component({
  selector: "lily-locale-picker",
  standalone: true,
  imports: [NgTemplateOutlet, IconButton, Listbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "(document:click)": "onDocumentClick($event)",
  },
  template: `
    <div
      #rootEl
      class="locale-picker {{ className() }}"
      (focusout)="onRootFocusOut($event)"
    >
      <input type="hidden" [name]="name()" [value]="value()" />

      <lily-icon-button
        #buttonEl
        [label]="label()"
        baseClass="locale-picker-button"
        ariaHaspopup="listbox"
        [ariaExpanded]="open()"
        [ariaControls]="listId"
        (click)="toggle()"
        (keydown)="onButtonKeydown($event)"
      >
        @if (iconTemplate(); as tpl) {
          <ng-container
            [ngTemplateOutlet]="tpl"
            [ngTemplateOutletContext]="childContext()"
          />
        } @else {
          <svg
            class="locale-picker-icon"
            viewBox="0 0 16 16"
            width="1.05rem"
            height="1.05rem"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="8" cy="8" r="6" />
            <path d="M2 8h12" />
            <path d="M8 2c2.2 0 4 2.7 4 6s-1.8 6-4 6-4-2.7-4-6 1.8-6 4-6z" />
          </svg>
        }
      </lily-icon-button>

      <lily-listbox
        #listEl
        [label]="label()"
        baseClass="locale-picker-list"
        [elementId]="listId"
        navigation="active-descendant"
        [clamp]="true"
        [typeahead]="true"
        [pageSize]="10"
        [(activeIndex)]="activeIndex"
        [hidden]="!open()"
        (activate)="choose($event)"
        (escape)="closeList()"
        (tabOut)="onListTabOut()"
      >
        @for (locale of locales(); track locale; let i = $index) {
          <li
            class="locale-picker-option"
            [id]="optionId(i)"
            role="option"
            [attr.aria-selected]="locale === value()"
            [attr.data-active]="i === activeIndex() ? '' : null"
            [attr.lang]="optionLang(locale)"
            (click)="choose(i)"
          >
            {{ labelFor(locale) }}
          </li>
        }
      </lily-listbox>
    </div>
  `,
})
export class LocalePicker {
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

  /** Projected icon template; replaces the default icon when supplied. */
  protected readonly iconTemplate = contentChild(TemplateRef);

  private readonly rootRef =
    viewChild.required<ElementRef<HTMLDivElement>>("rootEl");
  // Angular resolves a template-ref-variable on a component tag to the
  // component INSTANCE by default (not its ElementRef) — exactly what's
  // needed to call the headless components' own public `focus()` methods.
  private readonly buttonRef = viewChild.required<IconButton>("buttonEl");
  private readonly listRef = viewChild.required<Listbox>("listEl");

  private readonly baseId = nextLocalePickerId();
  protected readonly listId = `${this.baseId}-list`;

  protected readonly open = signal(false);
  protected readonly activeIndex = signal(-1);

  protected readonly childContext = computed(() => {
    const args: ChildArgs = {
      value: this.value(),
      open: this.open(),
      labelFor: (locale: string) => this.labelFor(locale),
    };
    return { $implicit: args, ...args };
  });

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
            initial =
              (typeof localStorage !== "undefined"
                ? localStorage.getItem(sk)
                : null) ?? "";
          } catch {
            // ignore privacy errors
          }
        }

        if (
          !initial &&
          this.detectFromNavigator() &&
          typeof navigator !== "undefined"
        ) {
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
          initial = dv || (locales.includes("en") ? "en" : locales[0]) || "";
        }

        if (initial && initial !== current) {
          this.value.set(initial);
          return;
        }
      }

      if (current) this.applyLocale(current);
    });
  }

  protected optionId(index: number): string {
    return `${this.baseId}-option-${index}`;
  }

  labelFor(locale: string): string {
    const labels = this.localeLabels();
    if (locale in labels) return labels[locale];
    // Endonym first: a language menu names each language in itself,
    // because the user who needs the menu is the one who cannot read
    // the page's language. The English table and the environment
    // lookup are fallbacks for runtimes without DisplayNames data.
    const endonym = localeEndonym(locale);
    if (endonym) return endonym;
    if (locale in defaultLocaleLabels) return defaultLocaleLabels[locale];
    const intl = intlDisplayName(locale);
    if (intl) return intl;
    return locale;
  }

  tagFor(locale: string): string {
    return bcp47LocaleTag(locale);
  }

  /**
   * The `lang` attribute for one option — a claim about the language
   * of the option's TEXT, made only when the text is the endonym we
   * derived ourselves. A consumer label or the English fallback is in
   * whatever language the consumer's UI speaks, and claiming otherwise
   * sends a screen reader's speech engine to the wrong voice: the
   * English word "Arabic" read out by an Arabic synthesizer.
   */
  optionLang(locale: string): string | null {
    if (locale in this.localeLabels()) return null;
    return localeEndonym(locale) ? bcp47LocaleTag(locale) : null;
  }

  // ---------------------------------------------------------------
  // Open / close
  // ---------------------------------------------------------------

  /** Under zoneless change detection the signal write that un-hides the
   * list has not reached the DOM when a microtask runs, so focusing the
   * still-hidden list fails silently and Escape lands on the button.
   * Flushing detection first is the Angular equivalent of Svelte's
   * synchronous update (same fix the date-time-picker port recorded). */
  private readonly cdr = inject(ChangeDetectorRef);

  protected toggle(): void {
    if (this.open()) this.closeList();
    else this.openList();
  }

  /** Open the listbox, activating `startIndex` (default: the selection). */
  openList(startIndex?: number): void {
    const selected = this.locales().indexOf(this.value());
    // An empty list has no option to activate; -1 keeps
    // aria-activedescendant off rather than pointing at an id that
    // does not exist.
    this.activeIndex.set(
      this.locales().length === 0
        ? -1
        : (startIndex ?? (selected >= 0 ? selected : 0)),
    );
    this.open.set(true);
    // Focus moves to the listbox; the active option is conveyed via
    // aria-activedescendant, per the APG listbox pattern.
    this.cdr.detectChanges();
    queueMicrotask(() => {
      this.listRef().focus({ preventScroll: true });
      this.scrollActiveIntoView();
    });
  }

  /** Close the listbox; `refocus` returns focus to the button. */
  closeList(refocus = true): void {
    if (!this.open()) return;
    this.open.set(false);
    this.activeIndex.set(-1);
    if (refocus) queueMicrotask(() => this.buttonRef().focus({ preventScroll: true }));
  }

  protected choose(index: number): void {
    const code = this.locales()[index];
    if (code) this.value.set(code);
    this.closeList();
  }

  private scrollActiveIntoView(): void {
    const i = this.activeIndex();
    if (i < 0) return;
    // getElementById rather than reaching into the composed Listbox's
    // DOM: Listbox exposes behaviour (focus()) and state (activeIndex),
    // not its rendered children, the same "consumer owns the option
    // elements" division of responsibility the headless component
    // documents for itself.
    const el = document.getElementById(this.optionId(i));
    // jsdom does not implement scrollIntoView; call it only if present.
    el?.scrollIntoView?.({ block: "nearest" });
  }

  // Arrow/Home/End/PageUp/PageDown/typeahead/Escape/Tab keyboard handling
  // inside the open list is owned by the composed `lily-listbox`'s
  // `navigation="active-descendant"` mode (see
  // @lilydesignsystem/angular-headless); this component only decides
  // what open/close/choose/scroll mean, and keeps the highlighted option
  // in view whenever activeIndex changes.
  private readonly scrollOnActiveIndexChange = effect(() => {
    this.activeIndex();
    this.scrollActiveIntoView();
  });

  // ---------------------------------------------------------------
  // Keyboard
  // ---------------------------------------------------------------

  protected onButtonKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case "ArrowDown":
      case "Enter":
      case " ":
        event.preventDefault();
        this.openList();
        break;
      case "ArrowUp":
        event.preventDefault();
        this.openList(this.locales().length - 1);
        break;
    }
  }

  /** `lily-listbox` Tab handling never prevents the key — focus goes to
   * the button FIRST so the browser's default Tab move computes from
   * the picker's position rather than from <body> (hiding the focused
   * list drops focus there, and the browser would otherwise compute the
   * default Tab move from the top of the document). */
  protected onListTabOut(): void {
    this.buttonRef().focus({ preventScroll: true });
    this.closeList(false);
  }

  protected onRootFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (next && this.rootRef().nativeElement.contains(next)) return;
    this.closeList(false);
  }

  protected onDocumentClick(event: Event): void {
    if (!this.open()) return;
    const t = event.target as Node | null;
    if (t && !this.rootRef().nativeElement.contains(t)) this.closeList(false);
  }

  // ---------------------------------------------------------------
  // Apply
  // ---------------------------------------------------------------

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
