import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  TemplateRef,
  computed,
  contentChild,
  effect,
  input,
  model,
  signal,
  viewChild,
} from "@angular/core";
// Only the trigger button composes a headless primitive. The panel is a disclosure of whatever the
// app projects into it — links, buttons, forms — so it carries no ARIA menu roles (role="menu" would
// promise a roving-focus menuitem widget that arbitrary content is not). See spec/index.md §3.
import { IconButton } from "@lilydesignsystem/angular-headless";

/** Context passed to a custom icon `<ng-template>` (the button icon). */
export type ChildArgs = {
  /** Is the panel open? */
  open: boolean;
};

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextMenuPickerId(): string {
  uid += 1;
  return `menu-picker-${uid}`;
}

/** The selector for focusable things inside the panel. */
export const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Marker for the projected icon template. Gives consumers typed `let-` variables:
 *
 * ```html
 * <lily-menu-picker label="Menu">
 *   <ng-template lilyMenuPickerIcon let-args>{{ args.open ? "×" : "☰" }}</ng-template>
 *   …the panel's content…
 * </lily-menu-picker>
 * ```
 */
@Directive({
  selector: "ng-template[lilyMenuPickerIcon]",
  standalone: true,
})
export class MenuPickerIcon {
  static ngTemplateContextGuard(
    _dir: MenuPickerIcon,
    _ctx: unknown,
  ): _ctx is ChildArgs & { $implicit: ChildArgs } {
    return true;
  }
}

/**
 * MenuPicker — a headless dropdown control.
 *
 * A single-icon button (a bundled hamburger SVG) that opens a disclosure panel holding whatever
 * the app projects into it. It applies nothing to the document and persists nothing. Give the
 * element a template reference (`#menu`) to call `menu.close()` from the projected content.
 * See `spec/index.md`.
 */
@Component({
  selector: "lily-menu-picker",
  standalone: true,
  exportAs: "lilyMenuPicker",
  imports: [NgTemplateOutlet, IconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "(document:click)": "onDocumentClick($event)",
  },
  template: `
    <div
      #rootEl
      class="menu-picker {{ className() }}"
      (focusout)="onRootFocusOut($event)"
    >
      <lily-icon-button
        #buttonEl
        [label]="label()"
        baseClass="menu-picker-button"
        [ariaExpanded]="open()"
        [ariaControls]="panelId"
        (click)="onButtonClick(); hoverButton.set(false)"
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
            class="menu-picker-icon"
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
            <path d="M1.5 3.5h13M1.5 8h13M1.5 12.5h13" />
          </svg>
        }
      </lily-icon-button>

      <!-- Purely visual: the same text is already the button's aria-label, so it is not wired
           with aria-describedby (that would announce the name twice). -->
      <div
        class="menu-picker-tooltip"
        role="tooltip"
        [id]="tooltipId"
        [attr.hidden]="tooltipVisible() ? null : ''"
        (mouseenter)="hoverTooltip.set(true)"
        (mouseleave)="hoverTooltip.set(false)"
      >{{ label() }}</div>

      <!-- A named group, not a menu: the content is the app's. The handlers are pure delegation
           for whatever focusable content the app projects. -->
      <div
        #panelEl
        class="menu-picker-panel"
        [id]="panelId"
        role="group"
        [attr.aria-label]="label() || null"
        [attr.hidden]="open() ? null : ''"
        (keydown)="onPanelKeydown($event)"
        (click)="onPanelClick($event)"
      >
        <ng-content />
      </div>
    </div>
  `,
})
export class MenuPicker {
  /** Accessible name for the button, the panel and the tooltip. */
  readonly label = input.required<string>();
  /** Is the panel open? Two-way bindable: `[(open)]`. */
  readonly open = model<boolean>(false);
  /**
   * Close the panel when a link, button or `[role="menuitem"]` inside it is activated. Add
   * `data-menu-picker-keep-open` to an element (or an ancestor) to opt it out. Default `true`.
   */
  readonly closeOnSelect = input<boolean>(true);
  /** Extra CSS class on the root div. */
  readonly className = input<string>("");

  /** Projected icon template; replaces the default icon when supplied. */
  protected readonly iconTemplate = contentChild(MenuPickerIcon, { read: TemplateRef });

  private readonly rootRef =
    viewChild.required<ElementRef<HTMLDivElement>>("rootEl");
  // A template-ref-variable on a component tag resolves to the component INSTANCE, which is what
  // is needed to call the headless component's own public `focus()` method.
  private readonly buttonRef = viewChild.required<IconButton>("buttonEl");
  private readonly panelRef =
    viewChild.required<ElementRef<HTMLDivElement>>("panelEl");

  private readonly baseId = nextMenuPickerId();
  protected readonly panelId = `${this.baseId}-panel`;

  // Tooltip: shown while the pointer is over the button or the tooltip itself (hoverable, WCAG
  // 1.4.13) or while the button has keyboard focus; Escape dismisses it without moving focus;
  // never shown while the popup is open, since the popup then explains the control.
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
    // Keyboard focus only: a mouse click also focuses the button in Chromium, and the tooltip
    // should not stick after a click.
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

  // WCAG 1.4.13 "dismissable": while the tooltip is visible, Escape works wherever focus is. The
  // listener exists only while visible; the effect cleanup removes it on hide and on destroy.
  private readonly tooltipEscapeListener = effect((onCleanup) => {
    if (!this.tooltipVisible() || typeof document === "undefined") return;
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") this.dismissed.set(true);
    };
    document.addEventListener("keydown", onKey);
    onCleanup(() => document.removeEventListener("keydown", onKey));
  });

  protected readonly childContext = computed(() => {
    const args: ChildArgs = { open: this.open() };
    return { $implicit: args, ...args };
  });

  private focusables(): HTMLElement[] {
    return Array.from(
      this.panelRef().nativeElement.querySelectorAll<HTMLElement>(FOCUSABLE),
    );
  }

  // ---------------------------------------------------------------
  // Open / close
  // ---------------------------------------------------------------

  /** Open the panel, optionally focusing its first or last focusable element. */
  openPanel(focus: "none" | "first" | "last" = "none"): void {
    this.open.set(true);
    if (focus === "none") return;
    // Deferred so the `hidden` attribute is gone before focus is moved.
    queueMicrotask(() => {
      const all = this.focusables();
      (focus === "last" ? all[all.length - 1] : all[0])?.focus({ preventScroll: true });
    });
  }

  /** Close the panel; `refocus` returns focus to the trigger. */
  closePanel(refocus = true): void {
    if (!this.open()) return;
    this.open.set(false);
    if (refocus) queueMicrotask(() => this.buttonRef().focus({ preventScroll: true }));
  }

  /** Close the panel and return focus to the button. For the projected content to call. */
  close(): void {
    this.closePanel();
  }

  protected onButtonClick(): void {
    if (this.open()) this.closePanel();
    else this.openPanel();
  }

  protected onPanelClick(event: MouseEvent): void {
    if (!this.closeOnSelect()) return;
    const target = event.target as Element | null;
    const hit = target?.closest?.('a[href], button, [role="menuitem"]');
    if (!hit || !this.panelRef().nativeElement.contains(hit)) return;
    if (hit.closest("[data-menu-picker-keep-open]")) return;
    this.closePanel();
  }

  // ---------------------------------------------------------------
  // Keyboard
  // ---------------------------------------------------------------

  protected onButtonKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape" && this.open()) {
      event.preventDefault();
      this.closePanel();
    } else if (event.key === "ArrowDown") {
      // Enter and Space already produce a click; the arrows open and move into the panel.
      event.preventDefault();
      if (!this.open()) this.openPanel("first");
      else this.focusables()[0]?.focus({ preventScroll: true });
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!this.open()) this.openPanel("last");
      else {
        const all = this.focusables();
        all[all.length - 1]?.focus({ preventScroll: true });
      }
    }
  }

  protected onPanelKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      event.preventDefault();
      this.closePanel();
    } else if (event.key === "Tab") {
      // Focus goes to the button FIRST, without cancelling the key, so the browser continues
      // from the picker's position rather than from <body>.
      this.buttonRef().focus?.({ preventScroll: true });
      this.closePanel(false);
    }
  }

  protected onRootFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (next && this.rootRef().nativeElement.contains(next)) return;
    this.closePanel(false);
  }

  protected onDocumentClick(event: Event): void {
    if (!this.open()) return;
    const t = event.target as Node | null;
    if (t && !this.rootRef().nativeElement.contains(t)) this.closePanel(false);
  }
}
