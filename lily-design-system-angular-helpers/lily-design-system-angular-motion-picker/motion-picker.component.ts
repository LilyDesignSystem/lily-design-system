import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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

/**
 * Default button glyph: U+23F8 PAUSE SIGN, paired with U+FE0E
 * (VARIATION SELECTOR-15) to force text presentation — the same
 * treatment locale-picker gives its globe.
 *
 * A pause glyph reads as "stop the moving parts" more directly than an
 * abstract symbol, has a real monochrome glyph in ordinary system
 * fonts (media-transport symbols default to text presentation, unlike
 * most pictographs), and doesn't collide with any sibling picker's
 * glyph (theme's CIRCLE WITH RIGHT HALF BLACK, locale's GLOBE WITH
 * MERIDIANS, text-size's plain "A", share's BLACK RIGHTWARDS
 * ARROWHEAD, date-time's CALENDAR).
 */
export const PAUSE_SIGN = "\u23F8\uFE0E";

/** Context passed to a custom icon `<ng-template>` (the button glyph). */
export type ChildArgs = {
  /** Currently selected motion slug. */
  value: string;
  /** Is the listbox open? */
  open: boolean;
  /** Resolve a slug to its display label. */
  labelFor: (motion: string) => string;
};

/**
 * Resolve a motion slug to its display label: each hyphen-separated
 * word title-cased, so a slug like "no-preference" renders as
 * "No Preference". Mirrors `sizeName` in text-size-picker and
 * `themeName` in theme-picker.
 */
export function motionName(motion: string): string {
  return motion
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * True when the platform reports a preference for reduced motion.
 * SSR-safe: `window`/`matchMedia` are absent on the server, so this
 * resolves to `false` there and the client re-derives it on mount.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextMotionPickerId(): string {
  uid += 1;
  return `motion-picker-${uid}`;
}

/**
 * Optional marker for the projected icon template. Gives consumers typed
 * `let-` variables:
 *
 * ```html
 * <lily-motion-picker ...>
 *   <ng-template lilyMotionPickerIcon let-args>{{ args.labelFor(args.value) }}</ng-template>
 * </lily-motion-picker>
 * ```
 *
 * The component queries any projected `<ng-template>`, so the marker is
 * for type-checking and readability, not for matching.
 */
@Directive({
  selector: "ng-template[lilyMotionPickerIcon]",
  standalone: true,
})
export class MotionPickerIcon {
  static ngTemplateContextGuard(
    _dir: MotionPickerIcon,
    _ctx: unknown,
  ): _ctx is ChildArgs & { $implicit: ChildArgs } {
    return true;
  }
}

/**
 * MotionPicker — `data-motion` reduced-motion picker.
 *
 * Renders an icon button that opens a WAI-ARIA APG listbox of motion
 * slugs. On every change the component sets `data-motion="{slug}"` on
 * the document root (or on a consumer-supplied target), with optional
 * `localStorage` persistence. Its initial value defers to the
 * platform's `(prefers-reduced-motion: reduce)` media query before
 * falling back to a fixed default — the one behaviour difference from
 * its `theme-picker`/`text-size-picker` siblings. Ships no CSS; the
 * consumer decides what `[data-motion="reduce"]` actually suppresses.
 * See `spec/index.md` for the full contract.
 */
@Component({
  selector: "lily-motion-picker",
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "(document:click)": "onDocumentClick($event)",
  },
  template: `
    <div
      #rootEl
      class="motion-picker {{ className() }}"
      (focusout)="onRootFocusOut($event)"
    >
      <input type="hidden" [name]="name()" [value]="value()" />

      <button
        #buttonEl
        type="button"
        class="motion-picker-button"
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
          <span class="motion-picker-icon" aria-hidden="true">{{
            glyph
          }}</span>
        }
      </button>

      <ul
        #listEl
        class="motion-picker-list"
        [id]="listId"
        role="listbox"
        [attr.aria-label]="label() || null"
        [attr.aria-activedescendant]="activeDescendant()"
        tabindex="-1"
        [attr.hidden]="open() ? null : ''"
        (keydown)="onListKeydown($event)"
      >
        @for (motion of motions(); track motion; let i = $index) {
          <li
            class="motion-picker-option"
            [id]="optionId(i)"
            role="option"
            [attr.aria-selected]="motion === value()"
            [attr.data-active]="i === activeIndex() ? '' : null"
            (click)="choose(i)"
          >
            {{ labelFor(motion) }}
          </li>
        }
      </ul>
    </div>
  `,
})
export class MotionPicker {
  readonly label = input.required<string>();
  readonly motions = input.required<string[]>();
  readonly value = model<string>("");
  readonly defaultValue = input<string>("");
  readonly storageKey = input<string>("");
  readonly name = input<string>("motion");
  readonly target = input<HTMLElement | null>(null);
  readonly motionLabels = input<Record<string, string>>({});
  readonly className = input<string>("");
  readonly motionChange = output<string>();

  /** Projected icon template; replaces the default glyph when supplied. */
  protected readonly iconTemplate = contentChild(TemplateRef);

  private readonly rootRef =
    viewChild.required<ElementRef<HTMLDivElement>>("rootEl");
  private readonly buttonRef =
    viewChild.required<ElementRef<HTMLButtonElement>>("buttonEl");
  private readonly listRef =
    viewChild.required<ElementRef<HTMLUListElement>>("listEl");

  protected readonly glyph = PAUSE_SIGN;

  private readonly baseId = nextMotionPickerId();
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
      labelFor: (motion: string) => this.labelFor(motion),
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

        if (!initial) {
          // Unlike text-size-picker's "medium" default, motion has a
          // real external signal to defer to: the platform's own
          // (prefers-reduced-motion: reduce) media query.
          const motions = this.motions();
          const dv = this.defaultValue();
          const osPreferred = prefersReducedMotion() ? "reduce" : "no-preference";
          initial =
            dv ||
            (motions.includes(osPreferred) ? osPreferred : undefined) ||
            motions[0] ||
            "";
        }

        if (initial && initial !== current) {
          this.value.set(initial);
          return;
        }
      }

      if (current) this.applyMotion(current);
    });
  }

  protected optionId(index: number): string {
    return `${this.baseId}-option-${index}`;
  }

  labelFor(motion: string): string {
    const labels = this.motionLabels();
    if (motion in labels) return labels[motion];
    return motionName(motion);
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
    const selected = this.motions().indexOf(this.value());
    // An empty list has no option to activate; -1 keeps
    // aria-activedescendant off rather than pointing at an id that
    // does not exist.
    this.activeIndex.set(
      this.motions().length === 0
        ? -1
        : (startIndex ?? (selected >= 0 ? selected : 0)),
    );
    this.open.set(true);
    // Focus moves to the listbox; the active option is conveyed via
    // aria-activedescendant, per the APG listbox pattern.
    this.cdr.detectChanges();
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
    const slug = this.motions()[index];
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
    const count = this.motions().length;
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
    // cycling. Only a buffer of differing characters refines the
    // match, and that buffer stays anchored on the active option.
    const sameCharRun =
      this.typeahead === "" || [...this.typeahead].every((c) => c === lower);
    this.typeahead += lower;
    clearTimeout(this.typeaheadTimer);
    this.typeaheadTimer = setTimeout(() => (this.typeahead = ""), 500);
    const query = sameCharRun ? lower : this.typeahead;
    const motions = this.motions();
    const anchor = this.activeIndex() < 0 ? 0 : this.activeIndex();
    const start = sameCharRun ? anchor + 1 : anchor;
    // Search forward, wrapping once — typeahead wraps even though the
    // arrows clamp, or options above the cursor would be untypable.
    for (let n = 0; n < motions.length; n++) {
      const i = (start + n) % motions.length;
      if (this.labelFor(motions[i]).toLowerCase().startsWith(query)) {
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
        this.openList(this.motions().length - 1);
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
        this.activeIndex.set(this.motions().length - 1);
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
        // ±10, clamped: an APG-optional key for long motion lists.
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

  private applyMotion(slug: string): void {
    if (typeof document === "undefined" || !slug) return;
    (this.target() ?? document.documentElement).setAttribute(
      "data-motion",
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
    this.motionChange.emit(slug);
  }
}
