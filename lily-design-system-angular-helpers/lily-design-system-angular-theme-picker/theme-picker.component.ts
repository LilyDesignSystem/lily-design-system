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

/**
 * Default button icon: a bundled SVG (contrast/half-circle), not a
 * Unicode character. Reversed 2026-09-16 from the font-dependent-glyph
 * convention (was U+25D1 CIRCLE WITH RIGHT HALF BLACK, exported as
 * `CIRCLE_WITH_RIGHT_HALF_BLACK` — removed, not renamed, since there is
 * no longer a single swappable character value). A bundled outline SVG
 * renders identically across every font stack and platform. `viewBox="0
 * 0 16 16"`, stroke-based (`stroke-width="1.6"`, round caps/joins) to
 * match the other four picker icons as one visual family. Override via
 * a projected `<ng-template>`, same as before.
 */

/** Context passed to a custom icon `<ng-template>` (the button icon). */
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
  imports: [NgTemplateOutlet, IconButton, Listbox],
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

      <lily-icon-button
        #buttonEl
        [label]="label()"
        baseClass="theme-picker-button"
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
            class="theme-picker-icon"
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
            <path d="M8 2a6 6 0 0 1 0 12z" fill="currentColor" stroke="none" />
          </svg>
        }
      </lily-icon-button>

      <lily-listbox
        #listEl
        [label]="label()"
        baseClass="theme-picker-list"
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
      </lily-listbox>
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

  /** Projected icon template; replaces the default icon when supplied. */
  protected readonly iconTemplate = contentChild(TemplateRef);

  private readonly rootRef =
    viewChild.required<ElementRef<HTMLDivElement>>("rootEl");
  // Angular resolves a template-ref-variable on a component tag to the
  // component INSTANCE by default (not its ElementRef) — exactly what's
  // needed to call the headless components' own public `focus()` methods.
  private readonly buttonRef = viewChild.required<IconButton>("buttonEl");
  private readonly listRef = viewChild.required<Listbox>("listEl");

  private readonly baseId = nextThemePickerId();
  protected readonly listId = `${this.baseId}-list`;

  protected readonly open = signal(false);
  protected readonly activeIndex = signal(-1);

  protected readonly childContext = computed(() => {
    const args: ChildArgs = {
      value: this.value(),
      open: this.open(),
      labelFor: (theme: string) => this.labelFor(theme),
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
    const slug = this.themes()[index];
    if (slug) this.value.set(slug);
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
        this.openList(this.themes().length - 1);
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
