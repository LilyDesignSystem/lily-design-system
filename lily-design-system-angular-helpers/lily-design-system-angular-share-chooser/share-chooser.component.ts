import { NgTemplateOutlet } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ElementRef,
  TemplateRef,
  computed,
  contentChild,
  input,
  output,
  signal,
  viewChild,
} from "@angular/core";

/**
 * Default button glyph: U+27A4 BLACK RIGHTWARDS ARROWHEAD.
 *
 * An in-font arrow rather than a pictograph, matching the other helpers'
 * rule: it renders in the page's own font on every platform and stays
 * monochrome alongside theme-chooser's ◑, locale-chooser's 🌐 and
 * text-size-chooser's "A".
 */
export const BLACK_RIGHTWARDS_ARROWHEAD = "\u27A4";

/**
 * One destination in the share list.
 *
 * `href` is a function, not a string, so the consumer owns the whole URL
 * — this package ships no third-party endpoints and takes no view on
 * which networks exist. See `spec/index.md` §3.
 */
export type ShareTarget = {
  /** Stable identifier, passed back on the `share` output. */
  id: string;
  /** Visible link text. Consumer-supplied, so it localises. */
  label: string;
  /** Build the destination URL from the shared page's metadata. */
  href: (url: string, title: string, text: string) => string;
  /** Overrides the default `target="_blank"` for this destination. */
  newTab?: boolean;
};

/** Context passed to a custom icon `<ng-template>` (the button glyph). */
export type ChildArgs = {
  /** Is the list open? */
  open: boolean;
  /** The URL that would be shared right now. */
  url: string;
};

/** How the button behaves when activated. */
export type ShareStrategy = "auto" | "native" | "list";

/** Payload of the `share` output: which destination, and the URL shared. */
export type ShareEvent = {
  /** The chosen target's `id`. */
  targetId: string;
  /** The URL that was shared. */
  url: string;
};

/** Is a native share sheet available? SSR-safe. */
export function canShareNatively(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

/** Is an async clipboard available? SSR-safe. */
export function canCopy(): boolean {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.clipboard?.writeText === "function"
  );
}

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextShareChooserId(): string {
  uid += 1;
  return `share-chooser-${uid}`;
}

/**
 * Optional marker for the projected icon template. Gives consumers typed
 * `let-` variables:
 *
 * ```html
 * <lily-share-chooser label="Share">
 *   <ng-template lilyShareChooserIcon let-args>{{ args.open ? "×" : "➤" }}</ng-template>
 * </lily-share-chooser>
 * ```
 *
 * The component queries any projected `<ng-template>`, so the marker is
 * for type-checking and readability, not for matching.
 */
@Directive({
  selector: "ng-template[lilyShareChooserIcon]",
  standalone: true,
})
export class ShareChooserIcon {
  static ngTemplateContextGuard(
    _dir: ShareChooserIcon,
    _ctx: unknown,
  ): _ctx is ChildArgs & { $implicit: ChildArgs } {
    return true;
  }
}

/**
 * ShareChooser — a headless share control.
 *
 * A single-glyph button (➤) that opens the **native share sheet** where
 * the browser provides one, and otherwise a disclosure list of
 * consumer-supplied destinations plus a built-in copy-the-URL action.
 *
 * Unlike the three preference helpers this owns an *action*, not a preference:
 * it applies nothing to the document and persists nothing. See
 * `spec/index.md` for the full contract.
 */
@Component({
  selector: "lily-share-chooser",
  standalone: true,
  imports: [NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "(document:click)": "onDocumentClick($event)",
  },
  template: `
    <div
      #rootEl
      class="share-chooser {{ className() }}"
      (focusout)="onRootFocusOut($event)"
    >
      <button
        #buttonEl
        type="button"
        class="share-chooser-button"
        [attr.aria-label]="label() || null"
        [attr.aria-expanded]="open()"
        [attr.aria-controls]="listId"
        (click)="onButtonClick()"
        (keydown)="onButtonKeydown($event)"
      >
        @if (iconTemplate(); as tpl) {
          <ng-container
            [ngTemplateOutlet]="tpl"
            [ngTemplateOutletContext]="childContext()"
          />
        } @else {
          <span class="share-chooser-icon" aria-hidden="true">{{ glyph }}</span>
        }
      </button>

      <ul
        #listEl
        class="share-chooser-list"
        [id]="listId"
        [attr.hidden]="open() ? null : ''"
        (keydown)="onListKeydown($event)"
      >
        @for (target of targets(); track target.id) {
          <li class="share-chooser-list-item">
            <!-- A real link, not role="menuitem": these ARE navigation,
                 and menuitem would strip middle-click, open-in-new-tab
                 and copy-link-address. -->
            <a
              class="share-chooser-target"
              [attr.data-target-id]="target.id"
              [attr.href]="hrefFor(target)"
              [attr.target]="target.newTab === false ? null : '_blank'"
              rel="noopener noreferrer"
              (click)="chooseTarget(target)"
              >{{ target.label }}</a
            >
          </li>
        }

        @if (copyLabel()) {
          <li class="share-chooser-list-item">
            <button type="button" class="share-chooser-copy" (click)="copyUrl()">
              {{ copyLabel() }}
            </button>
          </li>
        }
      </ul>

      <!-- Copying gives no visual feedback of its own, so the outcome is
           announced. Empty until something happens, so it stays silent on
           load; aria-live announces mutations only. -->
      <p class="share-chooser-status" aria-live="polite">{{ status() }}</p>
    </div>
  `,
})
export class ShareChooser {
  /** Accessible name for the button and the list. */
  readonly label = input.required<string>();
  /** Destinations to offer. Empty is valid when `copyLabel` is set. */
  readonly targets = input<ShareTarget[]>([]);
  /** URL to share. Defaults to the current page URL, read at share time. */
  readonly url = input<string>("");
  /** Title passed to `href(...)` and to the native share sheet. */
  readonly title = input<string>("");
  /** Longer text passed to `href(...)` and to the native share sheet. */
  readonly text = input<string>("");
  /**
   * Label for the built-in copy-to-clipboard item. The item renders only
   * when this is supplied — there is no default, because a default would
   * be a hardcoded English string.
   */
  readonly copyLabel = input<string>("");
  /** Announced in the status region after a successful copy. */
  readonly copiedLabel = input<string>("");
  /** Announced in the status region when the clipboard write fails. */
  readonly copyFailedLabel = input<string>("");
  /**
   * `"auto"` (default) uses the native share sheet when the browser
   * provides one and falls back to the list; `"native"` always tries the
   * sheet; `"list"` always shows the list.
   */
  readonly strategy = input<ShareStrategy>("auto");
  /** Extra CSS class on the root div. */
  readonly className = input<string>("");

  /** Fires after a destination is chosen. */
  readonly share = output<ShareEvent>();
  /** Fires after the URL is copied. */
  readonly copy = output<string>();
  /** Fires when the native share sheet was used instead of the list. */
  readonly nativeShare = output<string>();

  /** Projected icon template; replaces the default glyph when supplied. */
  protected readonly iconTemplate = contentChild(TemplateRef);

  private readonly rootRef = viewChild.required<ElementRef<HTMLDivElement>>("rootEl");
  private readonly buttonRef =
    viewChild.required<ElementRef<HTMLButtonElement>>("buttonEl");
  private readonly listRef = viewChild.required<ElementRef<HTMLUListElement>>("listEl");

  protected readonly glyph = BLACK_RIGHTWARDS_ARROWHEAD;

  private readonly baseId = nextShareChooserId();
  protected readonly listId = `${this.baseId}-list`;

  protected readonly open = signal(false);
  protected readonly status = signal("");

  protected readonly childContext = computed(() => {
    const args: ChildArgs = { open: this.open(), url: this.currentUrl() };
    return { $implicit: args, ...args };
  });

  /**
   * The URL to share. Resolved lazily — a plain method, not a computed —
   * so the default works without the consumer threading `location.href`
   * through, and so SSR never touches `location`.
   */
  currentUrl(): string {
    const explicit = this.url();
    if (explicit) return explicit;
    return typeof location !== "undefined" ? location.href : "";
  }

  protected hrefFor(target: ShareTarget): string {
    return target.href(this.currentUrl(), this.title(), this.text());
  }

  /** Every focusable item in the list, in DOM order. */
  private items(): HTMLElement[] {
    return Array.from(
      this.listRef().nativeElement.querySelectorAll<HTMLElement>(
        ".share-chooser-target, .share-chooser-copy",
      ),
    );
  }

  // ---------------------------------------------------------------
  // Open / close
  // ---------------------------------------------------------------

  /** Open the list, focusing the first item (or the last, if `focusLast`). */
  openList(focusLast = false): void {
    this.open.set(true);
    this.status.set("");
    // Deferred so the `hidden` attribute is gone before focus is moved.
    queueMicrotask(() => {
      const all = this.items();
      (focusLast ? all[all.length - 1] : all[0])?.focus();
    });
  }

  /** Close the list; `refocus` returns focus to the trigger. */
  closeList(refocus = true): void {
    if (!this.open()) return;
    this.open.set(false);
    if (refocus) queueMicrotask(() => this.buttonRef().nativeElement.focus());
  }

  private shareNatively(): Promise<boolean> {
    if (!canShareNatively()) return Promise.resolve(false);
    const shareUrl = this.currentUrl();
    // Rejections are handled with `.then(onOk, onErr)` rather than
    // `try { await ... }`. Both handle the rejection, but under zone.js
    // a rejection caught only by a native `await` is still reported as an
    // unhandled error against the click event task. Attaching the handler
    // at the call site keeps the console clean.
    return navigator
      .share({ url: shareUrl, title: this.title(), text: this.text() })
      .then(
        () => {
          this.nativeShare.emit(shareUrl);
          return true;
        },
        // A rejection here is almost always the user dismissing the
        // sheet, which is not an error and must not fall through to the
        // list — that would reopen UI they just dismissed.
        () => true,
      );
  }

  protected async onButtonClick(): Promise<void> {
    if (this.open()) {
      this.closeList();
      return;
    }
    const strategy = this.strategy();
    if (strategy === "native" || (strategy === "auto" && canShareNatively())) {
      if (await this.shareNatively()) return;
    }
    this.openList();
  }

  protected chooseTarget(target: ShareTarget): void {
    this.share.emit({ targetId: target.id, url: this.currentUrl() });
    this.closeList();
  }

  protected copyUrl(): Promise<void> {
    const shareUrl = this.currentUrl();

    /** Announce the outcome and close, whichever way the write went. */
    const settle = (ok: boolean): void => {
      if (ok) {
        this.copy.emit(shareUrl);
        const copied = this.copiedLabel();
        if (copied) this.status.set(copied);
      } else {
        const failed = this.copyFailedLabel();
        if (failed) this.status.set(failed);
      }
      this.closeList();
    };

    // No clipboard API at all is a failure, not a crash.
    if (!canCopy()) {
      settle(false);
      return Promise.resolve();
    }
    // `.then(onOk, onErr)` for the same zone.js reason as shareNatively().
    return navigator.clipboard.writeText(shareUrl).then(
      () => settle(true),
      () => settle(false),
    );
  }

  // ---------------------------------------------------------------
  // Keyboard
  // ---------------------------------------------------------------

  protected onButtonKeydown(event: KeyboardEvent): void {
    // Enter and Space are the button's own activation keys and already
    // produce a click; only the arrows need handling here.
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!this.open()) this.openList();
      else this.items()[0]?.focus();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!this.open()) this.openList(true);
      else {
        const all = this.items();
        all[all.length - 1]?.focus();
      }
    }
  }

  private moveFocus(delta: number): void {
    const all = this.items();
    if (all.length === 0) return;
    const i = all.indexOf(document.activeElement as HTMLElement);
    // Clamp rather than wrap.
    const next = Math.min(Math.max((i < 0 ? 0 : i) + delta, 0), all.length - 1);
    all[next]?.focus();
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
      case "Home": {
        event.preventDefault();
        this.items()[0]?.focus();
        break;
      }
      case "End": {
        event.preventDefault();
        const all = this.items();
        all[all.length - 1]?.focus();
        break;
      }
      case "Escape":
        event.preventDefault();
        this.closeList();
        break;
      case "Tab":
        // Tab leaves the control: close, but let focus go where the
        // browser was sending it.
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
