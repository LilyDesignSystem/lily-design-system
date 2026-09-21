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
 * Default button icon: a bundled SVG (a stroke-drawn "A"), not a
 * Unicode character. Reversed 2026-09-16 from the font-dependent-glyph
 * convention (was the plain letter U+0041, exported as
 * `LATIN_CAPITAL_LETTER_A` — removed, not renamed). "A" itself needed
 * no escaping and had no font-fallback risk, but it still varied in
 * weight and proportions across font stacks; a bundled outline SVG
 * matches the other four picker icons as one consistent visual family
 * regardless of the consumer's fonts.
 */

/** Context passed to a custom icon `<ng-template>` (the button icon). */
export type ChildArgs = {
  /** Currently selected size slug. */
  value: string;
  /** Is the listbox open? */
  open: boolean;
  /** Resolve a slug to its display label. */
  labelFor: (size: string) => string;
};

/**
 * Resolve a size slug to its display label: each hyphen-separated word
 * title-cased, so a slug like "x-large" renders as "X Large". Mirrors
 * `themeName` in theme-picker and `localeName` in locale-picker.
 */
export function sizeName(size: string): string {
  return size
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextTextSizePickerId(): string {
  uid += 1;
  return `text-size-picker-${uid}`;
}

/**
 * Optional marker for the projected icon template. Gives consumers typed
 * `let-` variables:
 *
 * ```html
 * <lily-text-size-picker ...>
 *   <ng-template lilyTextSizePickerIcon let-args>{{ args.labelFor(args.value) }}</ng-template>
 * </lily-text-size-picker>
 * ```
 *
 * The component queries any projected `<ng-template>`, so the marker is
 * for type-checking and readability, not for matching.
 */
@Directive({
  selector: "ng-template[lilyTextSizePickerIcon]",
  standalone: true,
})
export class TextSizePickerIcon {
  static ngTemplateContextGuard(
    _dir: TextSizePickerIcon,
    _ctx: unknown,
  ): _ctx is ChildArgs & { $implicit: ChildArgs } {
    return true;
  }
}

/**
 * TextSizePicker — `data-text-size` text-size picker.
 *
 * Renders an icon button that opens a WAI-ARIA APG listbox of sizes. On
 * every size change the component sets `data-text-size="{slug}"` on the
 * document root (or on a consumer-supplied target), with optional
 * `localStorage` persistence. Ships no CSS; the consumer maps each
 * `[data-text-size="…"]` slug to real typography. See `spec/index.md`
 * for the full contract.
 */
@Component({
  selector: "lily-text-size-picker",
  standalone: true,
  imports: [NgTemplateOutlet, IconButton, Listbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "(document:click)": "onDocumentClick($event)",
  },
  template: `
    <div
      #rootEl
      class="text-size-picker {{ className() }}"
      (focusout)="onRootFocusOut($event)"
    >
      <input type="hidden" [name]="name()" [value]="value()" />

      <lily-icon-button
        #buttonEl
        [label]="label()"
        baseClass="text-size-picker-button"
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
            class="text-size-picker-icon"
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
            <path d="M4 13 7.2 3h1.6L12 13M5.4 9.5h5.2" />
          </svg>
        }
      </lily-icon-button>

      <lily-listbox
        #listEl
        [label]="label()"
        baseClass="text-size-picker-list"
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
        @for (size of sizes(); track size; let i = $index) {
          <li
            class="text-size-picker-option"
            [id]="optionId(i)"
            role="option"
            [attr.aria-selected]="size === value()"
            [attr.data-active]="i === activeIndex() ? '' : null"
            (click)="choose(i)"
          >
            {{ labelFor(size) }}
          </li>
        }
      </lily-listbox>
    </div>
  `,
})
export class TextSizePicker {
  readonly label = input.required<string>();
  readonly sizes = input.required<string[]>();
  readonly value = model<string>("");
  readonly defaultValue = input<string>("");
  readonly storageKey = input<string>("");
  readonly name = input<string>("text-size");
  readonly target = input<HTMLElement | null>(null);
  readonly sizeLabels = input<Record<string, string>>({});
  readonly className = input<string>("");
  readonly sizeChange = output<string>();

  /** Projected icon template; replaces the default icon when supplied. */
  protected readonly iconTemplate = contentChild(TemplateRef);

  private readonly rootRef =
    viewChild.required<ElementRef<HTMLDivElement>>("rootEl");
  // Angular resolves a template-ref-variable on a component tag to the
  // component INSTANCE by default (not its ElementRef) — exactly what's
  // needed to call the headless components' own public `focus()` methods.
  private readonly buttonRef = viewChild.required<IconButton>("buttonEl");
  private readonly listRef = viewChild.required<Listbox>("listEl");

  private readonly baseId = nextTextSizePickerId();
  protected readonly listId = `${this.baseId}-list`;

  protected readonly open = signal(false);
  protected readonly activeIndex = signal(-1);

  protected readonly childContext = computed(() => {
    const args: ChildArgs = {
      value: this.value(),
      open: this.open(),
      labelFor: (size: string) => this.labelFor(size),
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

        if (!initial) {
          const sizes = this.sizes();
          const dv = this.defaultValue();
          initial =
            dv || (sizes.includes("medium") ? "medium" : sizes[0]) || "";
        }

        if (initial && initial !== current) {
          this.value.set(initial);
          return;
        }
      }

      if (current) this.applySize(current);
    });
  }

  protected optionId(index: number): string {
    return `${this.baseId}-option-${index}`;
  }

  labelFor(size: string): string {
    const labels = this.sizeLabels();
    if (size in labels) return labels[size];
    return sizeName(size);
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
    const selected = this.sizes().indexOf(this.value());
    // An empty list has no option to activate; -1 keeps
    // aria-activedescendant off rather than pointing at an id that
    // does not exist.
    this.activeIndex.set(
      this.sizes().length === 0
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
    const slug = this.sizes()[index];
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
        this.openList(this.sizes().length - 1);
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

  private applySize(slug: string): void {
    if (typeof document === "undefined" || !slug) return;
    (this.target() ?? document.documentElement).setAttribute(
      "data-text-size",
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
    this.sizeChange.emit(slug);
  }
}
