import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
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

import {
  defaultLocaleLabels,
  RTL_LANGUAGE_TAGS,
  RTL_SCRIPT_SUBTAGS,
} from "./locales";

/**
 * Default button glyph: U+1F310 GLOBE WITH MERIDIANS followed by
 * U+FE0E VARIATION SELECTOR-15.
 *
 * VS15 requests *text* presentation. Without it the browser picks the
 * colour-emoji font and the globe renders blue, which does not match
 * theme-select's monochrome ◑ — the two controls sit next to each
 * other in a page header and should read as one set.
 */
export const GLOBE_WITH_MERIDIANS = "\u{1F310}\uFE0E";

/** Context passed to a custom icon `<ng-template>` (the button glyph). */
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
export function nextLocaleSelectId(): string {
  uid += 1;
  return `locale-select-${uid}`;
}

/**
 * Optional marker for the projected icon template. Gives consumers typed
 * `let-` variables:
 *
 * ```html
 * <lily-locale-select ...>
 *   <ng-template lilyLocaleSelectIcon let-args>{{ args.labelFor(args.value) }}</ng-template>
 * </lily-locale-select>
 * ```
 *
 * The component queries any projected `<ng-template>`, so the marker is
 * for type-checking and readability, not for matching.
 */
@Directive({
  selector: "ng-template[lilyLocaleSelectIcon]",
  standalone: true,
})
export class LocaleSelectIcon {
  static ngTemplateContextGuard(
    _dir: LocaleSelectIcon,
    _ctx: unknown,
  ): _ctx is ChildArgs & { $implicit: ChildArgs } {
    return true;
  }
}

/**
 * LocaleSelect — `lang` + `dir` locale select.
 *
 * Renders an icon button that opens a WAI-ARIA APG listbox of locales. On
 * every locale change the component writes `lang` (and, by default, `dir`)
 * to the document root or a consumer-supplied target. See `spec/index.md`
 * for the full contract.
 */
@Component({
  selector: "lily-locale-select",
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "(document:click)": "onDocumentClick($event)",
  },
  template: `
    <div
      #rootEl
      class="locale-select {{ className() }}"
      (focusout)="onRootFocusOut($event)"
    >
      <input type="hidden" [name]="name()" [value]="value()" />

      <button
        #buttonEl
        type="button"
        class="locale-select-button"
        [attr.aria-label]="label() || null"
        aria-haspopup="listbox"
        [attr.aria-expanded]="open()"
        [attr.aria-controls]="listId"
        (click)="toggle()"
        (keydown)="onButtonKeydown($event)"
      >
        @if (iconTemplate(); as tpl) {
          <ng-container
            [ngTemplateOutlet]="tpl"
            [ngTemplateOutletContext]="childContext()"
          />
        } @else {
          <span class="locale-select-icon" aria-hidden="true">{{ glyph }}</span>
        }
      </button>

      <ul
        #listEl
        class="locale-select-list"
        [id]="listId"
        role="listbox"
        [attr.aria-label]="label() || null"
        [attr.aria-activedescendant]="activeDescendant()"
        tabindex="-1"
        [attr.hidden]="open() ? null : ''"
        (keydown)="onListKeydown($event)"
      >
        @for (locale of locales(); track locale; let i = $index) {
          <li
            class="locale-select-option"
            [id]="optionId(i)"
            role="option"
            [attr.aria-selected]="locale === value()"
            [attr.data-active]="i === activeIndex() ? '' : null"
            [attr.lang]="tagFor(locale)"
            (click)="choose(i)"
          >{{ labelFor(locale) }}</li>
        }
      </ul>
    </div>
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

  /** Projected icon template; replaces the default glyph when supplied. */
  protected readonly iconTemplate = contentChild(TemplateRef);

  private readonly rootRef = viewChild.required<ElementRef<HTMLDivElement>>("rootEl");
  private readonly buttonRef =
    viewChild.required<ElementRef<HTMLButtonElement>>("buttonEl");
  private readonly listRef = viewChild.required<ElementRef<HTMLUListElement>>("listEl");

  protected readonly glyph = GLOBE_WITH_MERIDIANS;

  private readonly baseId = nextLocaleSelectId();
  protected readonly listId = `${this.baseId}-list`;

  protected readonly open = signal(false);
  protected readonly activeIndex = signal(-1);

  /** `aria-activedescendant` is only meaningful while the listbox is open. */
  protected readonly activeDescendant = computed(() => {
    const i = this.activeIndex();
    return this.open() && i >= 0 ? this.optionId(i) : null;
  });

  protected readonly childContext = computed(() => {
    const args: ChildArgs = {
      value: this.value(),
      open: this.open(),
      labelFor: (locale: string) => this.labelFor(locale),
    };
    return { $implicit: args, ...args };
  });

  // Typeahead buffer: APG listbox behaviour. Reset after a pause.
  private typeahead = "";
  private typeaheadTimer: ReturnType<typeof setTimeout> | undefined;

  private initialised = false;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.typeaheadTimer));

    effect(() => {
      const current = this.value();

      if (!this.initialised) {
        this.initialised = true;
        let initial = current;

        const sk = this.storageKey();
        if (!initial && sk) {
          try {
            initial =
              (typeof localStorage !== "undefined" ? localStorage.getItem(sk) : null) ??
              "";
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
    if (locale in defaultLocaleLabels) return defaultLocaleLabels[locale];
    const intl = intlDisplayName(locale);
    if (intl) return intl;
    return locale;
  }

  tagFor(locale: string): string {
    return bcp47LocaleTag(locale);
  }

  // ---------------------------------------------------------------
  // Open / close
  // ---------------------------------------------------------------

  protected toggle(): void {
    if (this.open()) this.closeList();
    else this.openList();
  }

  /** Open the listbox, activating `startIndex` (default: the selection). */
  openList(startIndex?: number): void {
    const selected = this.locales().indexOf(this.value());
    this.activeIndex.set(startIndex ?? (selected >= 0 ? selected : 0));
    this.open.set(true);
    // Focus moves to the listbox; the active option is conveyed via
    // aria-activedescendant, per the APG listbox pattern.
    queueMicrotask(() => {
      this.listRef().nativeElement.focus();
      this.scrollActiveIntoView();
    });
  }

  /** Close the listbox; `refocus` returns focus to the button. */
  closeList(refocus = true): void {
    if (!this.open()) return;
    this.open.set(false);
    this.activeIndex.set(-1);
    if (refocus) queueMicrotask(() => this.buttonRef().nativeElement.focus());
  }

  protected choose(index: number): void {
    const code = this.locales()[index];
    if (code) this.value.set(code);
    this.closeList();
  }

  private scrollActiveIntoView(): void {
    const i = this.activeIndex();
    if (i < 0) return;
    const el = this.listRef().nativeElement.children[i] as HTMLElement | undefined;
    // jsdom does not implement scrollIntoView; call it only if present.
    el?.scrollIntoView?.({ block: "nearest" });
  }

  private moveActive(delta: number): void {
    const count = this.locales().length;
    if (count === 0) return;
    // Clamp rather than wrap, per the APG listbox pattern.
    this.activeIndex.set(Math.min(Math.max(this.activeIndex() + delta, 0), count - 1));
    this.scrollActiveIntoView();
  }

  private runTypeahead(char: string): void {
    this.typeahead += char.toLowerCase();
    clearTimeout(this.typeaheadTimer);
    this.typeaheadTimer = setTimeout(() => (this.typeahead = ""), 500);
    const locales = this.locales();
    const from = this.activeIndex() < 0 ? 0 : this.activeIndex();
    // Search forward from the active option, wrapping once.
    for (let n = 0; n < locales.length; n++) {
      const i = (from + n) % locales.length;
      if (this.labelFor(locales[i]).toLowerCase().startsWith(this.typeahead)) {
        this.activeIndex.set(i);
        this.scrollActiveIntoView();
        return;
      }
    }
  }

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

  protected onListKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        this.moveActive(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        this.moveActive(-1);
        break;
      case "Home":
        event.preventDefault();
        this.activeIndex.set(0);
        this.scrollActiveIntoView();
        break;
      case "End":
        event.preventDefault();
        this.activeIndex.set(this.locales().length - 1);
        this.scrollActiveIntoView();
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (this.activeIndex() >= 0) this.choose(this.activeIndex());
        break;
      case "Escape":
        event.preventDefault();
        this.closeList();
        break;
      case "Tab":
        // Tab moves on: close without stealing focus back.
        this.closeList(false);
        break;
      default:
        if (
          event.key.length === 1 &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.altKey
        ) {
          this.runTypeahead(event.key);
        }
    }
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
