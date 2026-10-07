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
  output,
  signal,
  viewChild,
} from "@angular/core";
// Only the trigger button composes a headless primitive. The list below is real `<a>` navigation
// with a roving-focus pattern of its own — not an ARIA listbox or menu: role="menuitem" would strip
// middle-click, open-in-new-tab and copy-link-address from ordinary links. See spec/index.md §3.
import { IconButton } from "@lilydesignsystem/angular-headless";

/**
 * One destination in the list. The app defines them all: this package ships no routes and no
 * English — `label` is the consumer's text.
 */
export type LinkItem = {
  /** Stable identifier, passed back on the `navigated` output. Defaults to `href`. */
  id?: string;
  /** Visible link text. Consumer-supplied, so it localises. */
  label: string;
  /** Where the link goes: a route ("/about/") or a full URL. */
  href: string;
  /** Marks this link as the current page (`aria-current="page"`). */
  current?: boolean;
  /** Open in a new tab (`target="_blank"` with `rel="noopener noreferrer"`). */
  newTab?: boolean;
};

/** Context passed to a custom icon `<ng-template>` (the button icon). */
export type ChildArgs = {
  /** Is the list open? */
  open: boolean;
};

/** Payload of the `navigated` output. */
export type LinkNavigatedEvent = {
  /** The chosen link's `id` (its `href` when it has none). */
  id: string;
  /** The chosen link's `href`. */
  href: string;
};

/** The id a link reports: its explicit `id`, else its `href`. */
export function linkId(link: LinkItem): string {
  return link.id ?? link.href;
}

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextLinkPickerId(): string {
  uid += 1;
  return `link-picker-${uid}`;
}

/**
 * Optional marker for the projected icon template. Gives consumers typed `let-` variables:
 *
 * ```html
 * <lily-link-picker label="Pages" [links]="links">
 *   <ng-template lilyLinkPickerIcon let-args>{{ args.open ? "×" : "☰" }}</ng-template>
 * </lily-link-picker>
 * ```
 */
@Directive({
  selector: "ng-template[lilyLinkPickerIcon]",
  standalone: true,
})
export class LinkPickerIcon {
  static ngTemplateContextGuard(
    _dir: LinkPickerIcon,
    _ctx: unknown,
  ): _ctx is ChildArgs & { $implicit: ChildArgs } {
    return true;
  }
}

/**
 * LinkPicker — a headless page-links control.
 *
 * A single-icon button (a bundled home SVG) that opens a disclosure list of page links the app
 * defines. It applies nothing to the document and persists nothing. See `spec/index.md`.
 */
@Component({
  selector: "lily-link-picker",
  standalone: true,
  imports: [NgTemplateOutlet, IconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "(document:click)": "onDocumentClick($event)",
  },
  template: `
    <div
      #rootEl
      class="link-picker {{ className() }}"
      (focusout)="onRootFocusOut($event)"
    >
      <lily-icon-button
        #buttonEl
        [label]="label()"
        baseClass="link-picker-button"
        [ariaExpanded]="open()"
        [ariaControls]="listId"
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
            class="link-picker-icon"
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
            <path d="M2 7.5 8 2.5l6 5" />
            <path d="M3.5 6.5v7h9v-7" />
            <path d="M6.5 13.5V10h3v3.5" />
          </svg>
        }
      </lily-icon-button>

      <!-- Purely visual: the same text is already the button's aria-label, so it is not wired
           with aria-describedby (that would announce the name twice). -->
      <div
        class="link-picker-tooltip"
        role="tooltip"
        [id]="tooltipId"
        [attr.hidden]="tooltipVisible() ? null : ''"
        (mouseenter)="hoverTooltip.set(true)"
        (mouseleave)="hoverTooltip.set(false)"
      >{{ label() }}</div>

      <!-- Named like the sibling pickers' popups: a screen reader entering the list hears what
           it is for. -->
      <ul
        #listEl
        class="link-picker-list"
        [id]="listId"
        [attr.aria-label]="label() || null"
        [attr.hidden]="open() ? null : ''"
        (keydown)="onListKeydown($event)"
      >
        @for (link of links(); track idOf(link)) {
          <li class="link-picker-list-item">
            <!-- A real link, not role="menuitem": these ARE navigation. -->
            <a
              class="link-picker-link"
              [attr.data-link-id]="idOf(link)"
              [attr.href]="link.href"
              [attr.aria-current]="link.current ? 'page' : null"
              [attr.target]="link.newTab ? '_blank' : null"
              [attr.rel]="link.newTab ? 'noopener noreferrer' : null"
              (click)="onLinkClick($event, link)"
              >{{ link.label }}</a
            >
          </li>
        }
      </ul>
    </div>
  `,
})
export class LinkPicker {
  /** Accessible name for the button and the list. */
  readonly label = input.required<string>();
  /** The page links to offer. Defined by the app. */
  readonly links = input.required<LinkItem[]>();
  /**
   * Client-side navigation hook, e.g. a router's `navigateByUrl`. When given, a plain left click
   * on a link calls `navigate(href)` instead of letting the browser load the page; modified
   * clicks (Ctrl/Cmd/Shift/Alt, middle button) and `newTab` links stay native.
   */
  readonly navigate = input<((href: string) => void) | undefined>(undefined);
  /** Extra CSS class on the root div. */
  readonly className = input<string>("");

  /** Fires after a link is chosen. */
  readonly navigated = output<LinkNavigatedEvent>();

  /** Projected icon template; replaces the default icon when supplied. */
  protected readonly iconTemplate = contentChild(TemplateRef);

  private readonly rootRef =
    viewChild.required<ElementRef<HTMLDivElement>>("rootEl");
  // A template-ref-variable on a component tag resolves to the component INSTANCE, which is what
  // is needed to call the headless component's own public `focus()` method.
  private readonly buttonRef = viewChild.required<IconButton>("buttonEl");
  private readonly listRef =
    viewChild.required<ElementRef<HTMLUListElement>>("listEl");

  private readonly baseId = nextLinkPickerId();
  protected readonly listId = `${this.baseId}-list`;

  protected readonly open = signal(false);

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

  protected idOf(link: LinkItem): string {
    return linkId(link);
  }

  /** Every focusable link in the list, in DOM order. */
  private items(): HTMLElement[] {
    return Array.from(
      this.listRef().nativeElement.querySelectorAll<HTMLElement>(".link-picker-link"),
    );
  }

  // ---------------------------------------------------------------
  // Open / close
  // ---------------------------------------------------------------

  /** Open the list, focusing the first link (or the last, if `focusLast`). */
  openList(focusLast = false): void {
    this.open.set(true);
    // Deferred so the `hidden` attribute is gone before focus is moved.
    queueMicrotask(() => {
      const all = this.items();
      (focusLast ? all[all.length - 1] : all[0])?.focus({ preventScroll: true });
    });
  }

  /** Close the list; `refocus` returns focus to the trigger. */
  closeList(refocus = true): void {
    if (!this.open()) return;
    this.open.set(false);
    if (refocus) queueMicrotask(() => this.buttonRef().focus({ preventScroll: true }));
  }

  protected onButtonClick(): void {
    if (this.open()) this.closeList();
    else this.openList();
  }

  protected onLinkClick(event: MouseEvent, link: LinkItem): void {
    this.navigated.emit({ id: linkId(link), href: link.href });
    const go = this.navigate();
    const modified =
      event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0;
    if (go && !link.newTab && !modified && !event.defaultPrevented) {
      event.preventDefault();
      go(link.href);
    }
    this.closeList();
  }

  // ---------------------------------------------------------------
  // Keyboard
  // ---------------------------------------------------------------

  protected onButtonKeydown(event: KeyboardEvent): void {
    // Enter and Space already produce a click; only the arrows need handling here.
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!this.open()) this.openList();
      else this.items()[0]?.focus({ preventScroll: true });
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!this.open()) this.openList(true);
      else {
        const all = this.items();
        all[all.length - 1]?.focus({ preventScroll: true });
      }
    }
  }

  private moveFocus(delta: number): void {
    const all = this.items();
    if (all.length === 0) return;
    const i = all.indexOf(document.activeElement as HTMLElement);
    // Clamp rather than wrap.
    const next = Math.min(Math.max((i < 0 ? 0 : i) + delta, 0), all.length - 1);
    all[next]?.focus({ preventScroll: true });
  }

  protected onListKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        this.moveFocus(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        this.moveFocus(-1);
        break;
      case "Home":
        event.preventDefault();
        this.items()[0]?.focus({ preventScroll: true });
        break;
      case "End": {
        event.preventDefault();
        const all = this.items();
        all[all.length - 1]?.focus({ preventScroll: true });
        break;
      }
      case "Escape":
        event.preventDefault();
        this.closeList();
        break;
      case "Tab":
        // Focus goes to the button FIRST, without cancelling the key: hiding the list while a
        // link has focus drops focus to <body>, and the default Tab would restart from the top.
        this.buttonRef().focus?.({ preventScroll: true });
        this.closeList(false);
        break;
      default:
        break;
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
}
