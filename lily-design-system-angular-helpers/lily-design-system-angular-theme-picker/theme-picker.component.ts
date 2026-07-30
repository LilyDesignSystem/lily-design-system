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

/** Default button glyph: U+25D1 CIRCLE WITH RIGHT HALF BLACK. */
export const CIRCLE_WITH_RIGHT_HALF_BLACK = "\u25D1";

/** Context passed to a custom icon `<ng-template>` (the button glyph). */
export type ChildArgs = {
  /** Currently selected theme slug. */
  value: string;
  /** Is the listbox open? */
  open: boolean;
  /** Resolve a slug to its display label. */
  labelFor: (theme: string) => string;
};

/**
 * Resolve a theme slug to its display label: each hyphen-separated word
 * title-cased, so a slug like
 * "united-kingdom-national-health-service-england-for-patients" renders
 * as "United Kingdom National Health Service England For Patients".
 * Mirrors `localeName` in locale-picker.
 */
export function themeName(theme: string): string {
  return theme
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Resolve the OS colour-scheme preference to a supported theme slug.
 * Mirrors `matchNavigatorLanguage` in locale-picker. Returns "" when the
 * preferred scheme is not in `themes`, or when matchMedia is unavailable
 * (SSR — jsdom does not implement it either).
 */
export function matchSystemTheme(themes: readonly string[]): string {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return "";
  }
  const wanted = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  return themes.includes(wanted) ? wanted : "";
}

/** Normalise the themes directory URL to end with exactly one "/". */
export function normaliseThemesUrl(themesUrl: string): string {
  return themesUrl.endsWith("/") ? themesUrl : themesUrl + "/";
}

/** Construct the href for a given theme slug. */
export function themeHref(
  themesUrl: string,
  slug: string,
  extension: string,
): string {
  return normaliseThemesUrl(themesUrl) + slug + extension;
}

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextThemePickerId(): string {
  uid += 1;
  return `theme-picker-${uid}`;
}

/**
 * Optional marker for the projected icon template. Gives consumers typed
 * `let-` variables:
 *
 * ```html
 * <lily-theme-picker ...>
 *   <ng-template lilyThemePickerIcon let-args>{{ args.labelFor(args.value) }}</ng-template>
 * </lily-theme-picker>
 * ```
 *
 * The component queries any projected `<ng-template>`, so the marker is
 * for type-checking and readability, not for matching.
 */
@Directive({
  selector: "ng-template[lilyThemePickerIcon]",
  standalone: true,
})
export class ThemePickerIcon {
  static ngTemplateContextGuard(
    _dir: ThemePickerIcon,
    _ctx: unknown,
  ): _ctx is ChildArgs & { $implicit: ChildArgs } {
    return true;
  }
}

/**
 * ThemePicker — dynamic theme CSS loader.
 *
 * Renders an icon button that opens a WAI-ARIA APG listbox of themes. On
 * every theme change the component swaps `href` on a managed
 * `<link rel="stylesheet">` in `document.head` and sets
 * `data-theme="{slug}"` on the document root (or on a consumer-supplied
 * target). See `spec/index.md` for the full contract.
 */
@Component({
  selector: "lily-theme-picker",
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "(document:click)": "onDocumentClick($event)",
  },
  template: `
    <div
      #rootEl
      class="theme-picker {{ className() }}"
      (focusout)="onRootFocusOut($event)"
    >
      <input type="hidden" [name]="name()" [value]="value()" />

      <button
        #buttonEl
        type="button"
        class="theme-picker-button"
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
          <span class="theme-picker-icon" aria-hidden="true">{{ glyph }}</span>
        }
      </button>

      <ul
        #listEl
        class="theme-picker-list"
        [id]="listId"
        role="listbox"
        [attr.aria-label]="label() || null"
        [attr.aria-activedescendant]="activeDescendant()"
        tabindex="-1"
        [attr.hidden]="open() ? null : ''"
        (keydown)="onListKeydown($event)"
      >
        @for (theme of themes(); track theme; let i = $index) {
          <li
            class="theme-picker-option"
            [id]="optionId(i)"
            role="option"
            [attr.aria-selected]="theme === value()"
            [attr.data-active]="i === activeIndex() ? '' : null"
            (click)="choose(i)"
          >
            {{ labelFor(theme) }}
          </li>
        }
      </ul>
    </div>
  `,
})
export class ThemePicker {
  readonly label = input.required<string>();
  readonly themesUrl = input.required<string>();
  readonly themes = input.required<string[]>();
  readonly value = model<string>("");
  readonly defaultValue = input<string>("");
  readonly storageKey = input<string>("");
  /** Resolve `prefers-color-scheme` to a supported theme on first visit. */
  readonly detectFromSystem = input<boolean>(false);
  readonly name = input<string>("theme");
  readonly extension = input<string>(".css");
  readonly target = input<HTMLElement | null>(null);
  readonly themeLabels = input<Record<string, string>>({});
  readonly className = input<string>("");
  readonly themeChange = output<string>();

  /** Projected icon template; replaces the default glyph when supplied. */
  protected readonly iconTemplate = contentChild(TemplateRef);

  private readonly rootRef =
    viewChild.required<ElementRef<HTMLDivElement>>("rootEl");
  private readonly buttonRef =
    viewChild.required<ElementRef<HTMLButtonElement>>("buttonEl");
  private readonly listRef =
    viewChild.required<ElementRef<HTMLUListElement>>("listEl");

  protected readonly glyph = CIRCLE_WITH_RIGHT_HALF_BLACK;

  private readonly baseId = nextThemePickerId();
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
      labelFor: (theme: string) => this.labelFor(theme),
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
              (typeof localStorage !== "undefined"
                ? localStorage.getItem(sk)
                : null) ?? "";
          } catch {
            // ignore privacy errors
          }
        }

        if (!initial && this.detectFromSystem()) {
          initial = matchSystemTheme(this.themes());
        }

        if (!initial) {
          const themes = this.themes();
          const dv = this.defaultValue();
          initial =
            dv || (themes.includes("light") ? "light" : themes[0]) || "";
        }

        if (initial && initial !== current) {
          this.value.set(initial);
          return;
        }
      }

      if (current) this.applyTheme(current);
    });
  }

  protected optionId(index: number): string {
    return `${this.baseId}-option-${index}`;
  }

  labelFor(theme: string): string {
    const labels = this.themeLabels();
    if (theme in labels) return labels[theme];
    return themeName(theme);
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
    const selected = this.themes().indexOf(this.value());
    // An empty list has no option to activate; -1 keeps
    // aria-activedescendant off rather than pointing at an id that
    // does not exist.
    this.activeIndex.set(
      this.themes().length === 0
        ? -1
        : (startIndex ?? (selected >= 0 ? selected : 0)),
    );
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
    const slug = this.themes()[index];
    if (slug) this.value.set(slug);
    this.closeList();
  }

  private scrollActiveIntoView(): void {
    const i = this.activeIndex();
    if (i < 0) return;
    const el = this.listRef().nativeElement.children[i] as
      HTMLElement | undefined;
    // jsdom does not implement scrollIntoView; call it only if present.
    el?.scrollIntoView?.({ block: "nearest" });
  }

  private moveActive(delta: number): void {
    const count = this.themes().length;
    if (count === 0) return;
    // Clamp rather than wrap, per the APG listbox pattern.
    this.activeIndex.set(
      Math.min(Math.max(this.activeIndex() + delta, 0), count - 1),
    );
    this.scrollActiveIntoView();
  }

  private runTypeahead(char: string): void {
    const lower = char.toLowerCase();
    // APG listbox typeahead: a single character moves to the NEXT
    // option starting with it, and repeating that character keeps
    // cycling — which is what makes the dark / dim / dracula run of a
    // long theme list reachable by pressing "d" three times. Only a
    // buffer of differing characters refines the match, and that
    // buffer stays anchored on the active option.
    const sameCharRun =
      this.typeahead === "" || [...this.typeahead].every((c) => c === lower);
    this.typeahead += lower;
    clearTimeout(this.typeaheadTimer);
    this.typeaheadTimer = setTimeout(() => (this.typeahead = ""), 500);
    const query = sameCharRun ? lower : this.typeahead;
    const themes = this.themes();
    const anchor = this.activeIndex() < 0 ? 0 : this.activeIndex();
    const start = sameCharRun ? anchor + 1 : anchor;
    // Search forward, wrapping once — typeahead wraps even though the
    // arrows clamp, or options above the cursor would be untypable.
    for (let n = 0; n < themes.length; n++) {
      const i = (start + n) % themes.length;
      if (this.labelFor(themes[i]).toLowerCase().startsWith(query)) {
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
        this.openList(this.themes().length - 1);
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
        this.activeIndex.set(this.themes().length - 1);
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
      case "PageUp":
        event.preventDefault();
        this.moveActive(-10);
        break;
      case "PageDown":
        // ±10, clamped: an APG-optional key that earns its place in a
        // 45-theme list.
        event.preventDefault();
        this.moveActive(10);
        break;
      case "Tab":
        // Tab moves on — but focus goes to the button FIRST, without
        // cancelling the key. Hiding the focused list drops focus to
        // <body>, and the browser then computes the default Tab move
        // from the top of the document, so tabbing out of an open
        // picker teleported the user to the page's first tab stop.
        // From the button, the default Tab lands exactly where leaving
        // the picker should. The button always exists, so no
        // detectChanges is needed before the focus move; guard the
        // METHOD because jsdom-shaped hosts may not implement it.
        this.buttonRef().nativeElement.focus?.();
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

  private getManagedLink(): HTMLLinkElement | null {
    if (typeof document === "undefined") return null;
    const selector = `link[data-lily-theme-picker="${this.name()}"]`;
    let link = document.head.querySelector<HTMLLinkElement>(selector);
    if (!link) {
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.setAttribute("data-lily-theme-picker", this.name());
      document.head.appendChild(link);
    }
    return link;
  }

  private applyTheme(slug: string): void {
    if (typeof document === "undefined" || !slug) return;
    const link = this.getManagedLink();
    if (link) link.href = themeHref(this.themesUrl(), slug, this.extension());
    (this.target() ?? document.documentElement).setAttribute(
      "data-theme",
      slug,
    );

    const sk = this.storageKey();
    if (sk) {
      try {
        localStorage.setItem(sk, slug);
      } catch {
        // ignore quota / privacy errors
      }
    }
    this.themeChange.emit(slug);
  }
}
