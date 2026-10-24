import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  contentChild,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  model,
  output,
  signal,
  TemplateRef,
  viewChild,
} from "@angular/core";
import { IconButton, Listbox } from "@lilydesignsystem/angular-headless";
import { DEFAULT_ZONES, matchZone, orderedZones, systemZone, zoneInfo, type ZoneInfo, type ZoneNames } from "./zones.js";

export { DEFAULT_ZONES };
export type { ZoneInfo, ZoneNames };

/** Context passed to a custom icon `<ng-template>` (the button icon). */
export type ChildArgs = {
  /** Currently selected zone, an IANA id. */
  value: string;
  /** Is the listbox open? */
  open: boolean;
  /** Offset, name and label of any zone. */
  infoFor: (zone: string) => ZoneInfo | undefined;
};

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextTimeZonePickerId(): string {
  uid += 1;
  return `time-zone-picker-${uid}`;
}

/**
 * Optional marker for the projected icon template. Gives consumers typed
 * `let-` variables:
 *
 * ```html
 * <lily-time-zone-picker ...>
 *   <ng-template lilyTimeZonePickerIcon let-args>{{ args.infoFor(args.value)?.offset }}</ng-template>
 * </lily-time-zone-picker>
 * ```
 *
 * The component queries any projected `<ng-template>`, so the marker is
 * for type-checking and readability, not for matching.
 */
@Directive({
  selector: "ng-template[lilyTimeZonePickerIcon]",
  standalone: true,
})
export class TimeZonePickerIcon {
  static ngTemplateContextGuard(
    _dir: TimeZonePickerIcon,
    _ctx: unknown,
  ): _ctx is ChildArgs & { $implicit: ChildArgs } {
    return true;
  }
}

/**
 * TimeZonePicker — `data-time-zone` time-zone picker.
 *
 * Renders an icon button that opens a WAI-ARIA APG listbox of time zones. On
 * every change the component sets `data-time-zone="{IANA id}"` on the
 * document root (or on a consumer-supplied target), with optional
 * `localStorage` persistence. Ships no CSS; the consumer maps each
 * `[data-time-zone="…"]` slug to real typography. See `spec/index.md`
 * for the full contract.
 */
@Component({
  selector: "lily-time-zone-picker",
  standalone: true,
  imports: [NgTemplateOutlet, IconButton, Listbox],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "(document:click)": "onDocumentClick($event)",
  },
  template: `
    <div
      #rootEl
      class="time-zone-picker {{ className() }}"
      (focusout)="onRootFocusOut($event)"
    >
      <input type="hidden" [name]="name()" [value]="value()" />

      <lily-icon-button
        [disabled]="disabled()"
        #buttonEl
        [label]="label()"
        baseClass="time-zone-picker-button"
        ariaHaspopup="listbox"
        [ariaExpanded]="open()"
        [ariaControls]="listId"
        (click)="toggle(); hoverButton.set(false)"
        (mouseenter)="onTooltipButtonEnter()"
        (mouseleave)="hoverButton.set(false)"
        (focusin)="onTooltipButtonFocusIn()"
        (focusout)="onTooltipButtonFocusOut()"
        (keydown)="onButtonKeydown($event); onTooltipKeydown($event)"
      >
        @if (iconTemplate(); as tpl) {
          <ng-container
            [ngTemplateOutlet]="tpl"
            [ngTemplateOutletContext]="childContext()"
          />
        } @else {
          <svg
            class="time-zone-picker-icon"
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
            <path d="M8 2.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11zM8 5v3l2 1.5" />
          </svg>
        }
      </lily-icon-button>

      <!-- Purely visual: the same text is already the button's aria-label,
           so it is not wired with aria-describedby (that would announce
           the name twice). -->
      <div
        class="time-zone-picker-tooltip"
        role="tooltip"
        [id]="tooltipId"
        [attr.hidden]="tooltipVisible() ? null : ''"
        (mouseenter)="hoverTooltip.set(true)"
        (mouseleave)="hoverTooltip.set(false)"
      >{{ label() }}</div>

      <lily-listbox
        #listEl
        [label]="label()"
        baseClass="time-zone-picker-list"
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
        @for (zone of infos(); track zone.id; let i = $index) {
          <li
            class="time-zone-picker-option"
            [id]="optionId(i)"
            role="option"
            [attr.aria-selected]="zone.id === value()"
            [attr.data-active]="i === activeIndex() ? '' : null"
            [attr.data-offset]="zone.offset"
            (click)="choose(i)"
          >
            {{ zone.label }}
          </li>
        }
      </lily-listbox>
    </div>
  `,
})
export class TimeZonePicker {
  readonly label = input.required<string>();
  /** BCP 47 tag the zone names are written in. Required: the picker never picks a language for you. */
  readonly locale = input.required<string>();
  /** IANA zone ids to offer. Default: DEFAULT_ZONES. Shown ordered by offset, not in this order. */
  readonly zones = input<readonly string[]>(DEFAULT_ZONES);
  /** The moment offsets and names are worked out for. Default: now, read once. */
  readonly date = input<Date | undefined>(undefined);
  /** Builds an option's text from its info. Default: `UTC+01:00 – Central European Standard Time`. */
  readonly labelFor = input<((zone: ZoneInfo) => string) | undefined>(undefined);
  /** Zone names by IANA id (one name, or `[standard, daylight]`), which win over `Intl`: from the locale-translations zone-name packs (CLDR) via `zoneNamesFrom()`. */
  readonly names = input<ZoneNames | undefined>(undefined);
  readonly value = model<string>("");
  readonly defaultValue = input<string>("");
  readonly storageKey = input<string>("");
  readonly name = input<string>("time-zone");
  readonly target = input<HTMLElement | null>(null);
  readonly className = input<string>("");
  readonly zoneChange = output<string>();

  /** Projected icon template; replaces the default icon when supplied. */
  protected readonly iconTemplate = contentChild(TemplateRef);

  private readonly rootRef =
    viewChild.required<ElementRef<HTMLDivElement>>("rootEl");
  // Angular resolves a template-ref-variable on a component tag to the
  // component INSTANCE by default (not its ElementRef) — exactly what's
  // needed to call the headless components' own public `focus()` methods.
  private readonly buttonRef = viewChild.required<IconButton>("buttonEl");
  private readonly listRef = viewChild.required<Listbox>("listEl");

  private readonly baseId = nextTimeZonePickerId();
  protected readonly listId = `${this.baseId}-list`;

  /** Is the popup open? Two-way bindable: `[(open)]`; `openChange` fires for each change. */
  readonly open = model<boolean>(false);
  /** Disables the button; an open popup closes. */
  readonly disabled = input<boolean>(false);
  private readonly closeWhenDisabled = effect(() => {
    if (this.disabled() && this.open()) this.open.set(false);
  });

  // Tooltip: shown while the pointer is over the button or the tooltip
  // itself (hoverable, WCAG 1.4.13) or while the button has keyboard
  // focus; Escape dismisses it without moving focus; never shown while
  // the popup is open, since the popup then explains the control.
  protected readonly tooltipId = `${this.baseId}-tooltip`;
  protected readonly hoverButton = signal(false);
  protected readonly hoverTooltip = signal(false);
  protected readonly focusButton = signal(false);
  protected readonly dismissed = signal(false);
  protected readonly tooltipVisible = computed(
    () =>
      !this.open() &&
      !this.dismissed() &&
      (this.hoverButton() || this.hoverTooltip() || this.focusButton()),
  );

  protected onTooltipButtonEnter(): void {
    this.hoverButton.set(true);
    this.dismissed.set(false);
  }

  protected onTooltipButtonFocusIn(): void {
    // Keyboard focus only: a mouse click also focuses the button in
    // Chromium, and the tooltip should not stick after a click.
    try {
      this.focusButton.set(
        this.buttonRef().element?.matches(":focus-visible") ?? false,
      );
    } catch {
      this.focusButton.set(true); // engine without :focus-visible — err towards showing
    }
  }

  protected onTooltipButtonFocusOut(): void {
    this.focusButton.set(false);
    this.dismissed.set(false);
  }

  protected onTooltipKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape" && this.tooltipVisible()) this.dismissed.set(true);
  }

  // WCAG 1.4.13 "dismissable": while the tooltip is visible, Escape works
  // wherever focus is (hover-only tooltips have focus elsewhere). The
  // listener exists only while visible; the effect cleanup removes it on
  // hide and on destroy. No preventDefault/stopPropagation, focus untouched.
  private readonly tooltipEscapeListener = effect((onCleanup) => {
    if (!this.tooltipVisible() || typeof document === "undefined") return;
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") this.dismissed.set(true);
    };
    document.addEventListener("keydown", onKey);
    onCleanup(() => document.removeEventListener("keydown", onKey));
  });
  protected readonly activeIndex = signal(-1);

  // The zones as the listbox shows them, ordered by offset. The date is read once when none is given: a picker
  // that re-sorted itself while open would move the option under the pointer.
  private readonly whenInitial = new Date();
  private readonly when = computed(() => this.date() ?? this.whenInitial);
  protected readonly infos = computed(() => orderedZones(this.zones(), this.locale(), this.when(), this.labelFor(), this.names()));
  protected readonly ids = computed(() => this.infos().map((z) => z.id));
  infoFor(zone: string): ZoneInfo | undefined {
    return zoneInfo(zone, this.locale(), this.when(), this.labelFor(), this.names());
  }

  protected readonly childContext = computed(() => {
    const args: ChildArgs = {
      value: this.value(),
      open: this.open(),
      infoFor: (zone: string) => this.infoFor(zone),
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
        // A stored zone that is no longer offered is not restored.
        if (!initial && sk) {
          try {
            const stored =
              (typeof localStorage !== "undefined"
                ? localStorage.getItem(sk)
                : null) ?? "";
            if (this.ids().includes(stored)) initial = stored;
          } catch {
            // ignore privacy errors
          }
        }

        if (!initial) {
          const ids = this.ids();
          const dv = this.defaultValue();
          // The reader's own zone when it is listed (or has a listed twin), else UTC, else the first.
          initial =
            dv ||
            matchZone(systemZone(), this.infos(), this.locale(), this.when(), this.names()) ||
            (ids.includes("UTC") ? "UTC" : ids[0]) ||
            "";
        }

        if (initial && initial !== current) {
          this.value.set(initial);
          return;
        }
      }

      if (current) this.applyZone(current);
    });
  }

  protected optionId(index: number): string {
    return `${this.baseId}-option-${index}`;
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
    const selected = this.ids().indexOf(this.value());
    // An empty list has no option to activate; -1 keeps
    // aria-activedescendant off rather than pointing at an id that
    // does not exist.
    this.activeIndex.set(
      this.ids().length === 0
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
    const slug = this.ids()[index];
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
        this.openList(this.ids().length - 1);
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

  private applyZone(slug: string): void {
    if (typeof document === "undefined" || !slug) return;
    (this.target() ?? document.documentElement).setAttribute(
      "data-time-zone",
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
    this.zoneChange.emit(slug);
  }
}
