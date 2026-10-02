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
  model,
  output,
  signal,
  viewChild,
} from "@angular/core";
// Only the trigger button composes a headless primitive. The panel is a
// real <form role="search"> with a real search field and a real submit
// button — a disclosure, not a listbox or a menu — so headless `Listbox`
// is the wrong widget for it, not merely an unmigrated one.
import { IconButton } from "@lilydesignsystem/angular-headless";

/**
 * The submit button's visible content: U+23CE RETURN SYMBOL, a bare
 * literal character (never an escape — see `bin/test`'s glyph check).
 * It is the button's visible label only; the accessible name comes from
 * the required `submitLabel` input, so assistive technology never has to
 * announce a symbol.
 */
export const RETURN_SYMBOL = "⏎";

/** Context passed to a custom icon `<ng-template>` (the button icon). */
export type ChildArgs = {
  /** Is the search panel open? */
  open: boolean;
  /** The current text in the search field. */
  query: string;
};

/** Payload of the `searched` output: the trimmed query and its destination. */
export type SearchEvent = {
  /** The trimmed, non-empty query. */
  query: string;
  /** Where the search navigates: `searchHref(query, action)`. */
  href: string;
};

/**
 * The destination for a query: `action` + `?` + the URI-encoded, trimmed
 * query. `searchHref("foo")` is `"/?foo"`; `searchHref("foo bar")` is
 * `"/?foo%20bar"`.
 */
export function searchHref(query: string, action = "/"): string {
  return `${action}?${encodeURIComponent(query.trim())}`;
}

let uid = 0;
/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
export function nextSearchPickerId(): string {
  uid += 1;
  return `search-picker-${uid}`;
}

/**
 * Optional marker for the projected icon template. Gives consumers typed
 * `let-` variables:
 *
 * ```html
 * <lily-search-picker label="Search" inputLabel="Search terms" submitLabel="Search">
 *   <ng-template lilySearchPickerIcon let-args>{{ args.open ? "×" : "🔍" }}</ng-template>
 * </lily-search-picker>
 * ```
 *
 * The component queries any projected `<ng-template>`, so the marker is
 * for type-checking and readability, not for matching.
 */
@Directive({
  selector: "ng-template[lilySearchPickerIcon]",
  standalone: true,
})
export class SearchPickerIcon {
  static ngTemplateContextGuard(
    _dir: SearchPickerIcon,
    _ctx: unknown,
  ): _ctx is ChildArgs & { $implicit: ChildArgs } {
    return true;
  }
}

/**
 * SearchPicker — a headless site-search control.
 *
 * A single-icon button (a bundled magnifying-glass SVG) that opens a
 * dropdown holding a search field and, at its right, a `⏎` submit button.
 * Return in the field, or the `⏎` button, navigates to `/?<query>` — a
 * search for `foo` goes to `/?foo`.
 *
 * Like `share-picker` this owns an *action*, not a preference: it applies
 * nothing to the document and persists nothing. See `spec/index.md` for
 * the full contract.
 */
@Component({
  selector: "lily-search-picker",
  standalone: true,
  imports: [NgTemplateOutlet, IconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "(document:click)": "onDocumentClick($event)",
  },
  template: `
    <div
      #rootEl
      class="search-picker {{ className() }}"
      (focusout)="onRootFocusOut($event)"
    >
      <lily-icon-button
        #buttonEl
        [label]="label()"
        baseClass="search-picker-button"
        [ariaExpanded]="open()"
        [ariaControls]="panelId"
        (click)="onButtonClick()"
      >
        @if (iconTemplate(); as tpl) {
          <ng-container
            [ngTemplateOutlet]="tpl"
            [ngTemplateOutletContext]="childContext()"
          />
        } @else {
          <svg
            class="search-picker-icon"
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
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5 14 14" />
          </svg>
        }
      </lily-icon-button>

      <!-- The keydown handler only listens for Escape bubbling up from the
           field and the submit button inside; the panel itself takes no
           focus. -->
      <div
        #panelEl
        class="search-picker-panel"
        [id]="panelId"
        [attr.hidden]="open() ? null : ''"
        (keydown)="onPanelKeydown($event)"
      >
        <form
          class="search-picker-form"
          role="search"
          [attr.aria-label]="label()"
          [attr.action]="action()"
          method="get"
          (submit)="onSubmit($event)"
        >
          <input
            #inputEl
            class="search-picker-input"
            type="search"
            [attr.aria-label]="inputLabel()"
            [attr.placeholder]="placeholder() ?? null"
            enterkeyhint="search"
            [value]="value()"
            (input)="value.set($any($event.target).value)"
          />
          <button
            type="submit"
            class="search-picker-submit"
            [attr.aria-label]="submitLabel()"
          >
            <span class="search-picker-submit-symbol" aria-hidden="true">{{
              returnSymbol
            }}</span>
          </button>
        </form>
      </div>
    </div>
  `,
})
export class SearchPicker {
  /** Accessible name for the icon button and the search landmark. */
  readonly label = input.required<string>();
  /** Accessible name for the search text field. */
  readonly inputLabel = input.required<string>();
  /** Accessible name for the ⏎ submit button. */
  readonly submitLabel = input.required<string>();
  /** Placeholder text for the search field. No default. */
  readonly placeholder = input<string | undefined>(undefined);
  /** The search text. Two-way bindable: `[(value)]`. */
  readonly value = model<string>("");
  /**
   * Path the query is appended to. The search for `foo` navigates to
   * `${action}?foo`; the default `"/"` gives `/?foo`.
   */
  readonly action = input<string>("/");
  /**
   * Performs the navigation. Defaults to `location.assign(href)` — a real
   * GET request. Pass a client-side router's navigate function (e.g.
   * `(href) => router.navigateByUrl(href)`) to keep the navigation in-app.
   */
  readonly navigate = input<((href: string) => void) | undefined>(undefined);
  /** Extra CSS class on the root div. */
  readonly className = input<string>("");

  /**
   * Fires with the trimmed query and the destination, before navigating.
   * Named `searched`, not `search`: `<input type="search">` fires a
   * native, bubbling `search` DOM event in Chromium and WebKit, and
   * Angular binds `(search)` on a component host to BOTH the output and
   * any same-named DOM event — the handler would receive a raw `Event`
   * on every Return.
   */
  readonly searched = output<SearchEvent>();

  /** Projected icon template; replaces the default icon when supplied. */
  protected readonly iconTemplate = contentChild(TemplateRef);

  private readonly rootRef =
    viewChild.required<ElementRef<HTMLDivElement>>("rootEl");
  // A template-ref-variable on a component tag resolves to the component
  // INSTANCE — exactly what's needed to call IconButton's own `focus()`.
  private readonly buttonRef = viewChild.required<IconButton>("buttonEl");
  private readonly panelRef =
    viewChild.required<ElementRef<HTMLDivElement>>("panelEl");
  private readonly inputRef =
    viewChild.required<ElementRef<HTMLInputElement>>("inputEl");

  private readonly baseId = nextSearchPickerId();
  protected readonly panelId = `${this.baseId}-panel`;
  protected readonly returnSymbol = RETURN_SYMBOL;

  protected readonly open = signal(false);

  protected readonly childContext = computed(() => {
    const args: ChildArgs = { open: this.open(), query: this.value() };
    return { $implicit: args, ...args };
  });

  // ---------------------------------------------------------------
  // Open / close
  // ---------------------------------------------------------------

  /** Open the panel and move focus into the search field. */
  openPanel(): void {
    this.open.set(true);
    // Unhide the panel now rather than waiting for change detection, so
    // the field is focusable in this same task — whether the host app is
    // zone-based or zoneless, the template binding settles on the same
    // value afterwards. preventScroll: the panel is positioned by
    // consumer CSS, and focusing a field rendered partly off-screen would
    // otherwise scroll the whole page.
    this.panelRef().nativeElement.removeAttribute("hidden");
    this.inputRef().nativeElement.focus({ preventScroll: true });
  }

  /** Close the panel; `refocus` returns focus to the trigger. */
  closePanel(refocus = true): void {
    if (!this.open()) return;
    // Focus the trigger BEFORE hiding the panel, so focus never drops to
    // <body> in between.
    if (refocus) this.buttonRef().focus({ preventScroll: true });
    this.open.set(false);
  }

  protected onButtonClick(): void {
    if (this.open()) this.closePanel();
    else this.openPanel();
  }

  protected onPanelKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      event.preventDefault();
      this.closePanel();
    }
  }

  protected onRootFocusOut(event: FocusEvent): void {
    // Close only when focus moves to a known element outside the picker.
    // A focusout with no relatedTarget is not "focus left": Safari does
    // not focus a <button> on click, so pressing ⏎ (or the icon button)
    // blurs the field with relatedTarget = null. Closing there hid the
    // panel before the click landed, so ⏎ never searched and the icon
    // button re-opened instead of closing. Clicks outside the picker are
    // handled by the document click listener below.
    const next = event.relatedTarget as Node | null;
    if (!next || this.rootRef().nativeElement.contains(next)) return;
    this.closePanel(false);
  }

  protected onDocumentClick(event: Event): void {
    if (!this.open()) return;
    const t = event.target as Node | null;
    if (t && !this.rootRef().nativeElement.contains(t)) this.closePanel(false);
  }

  // ---------------------------------------------------------------
  // Searching
  // ---------------------------------------------------------------

  protected onSubmit(event: Event): void {
    // The form's native GET would send `/?name=value`; the contract is
    // the bare query (`/?foo`), so navigation is done here instead.
    event.preventDefault();
    const query = this.value().trim();
    if (!query) return;
    const href = searchHref(query, this.action());
    this.searched.emit({ query, href });
    this.closePanel(false);
    const navigate = this.navigate();
    if (navigate) navigate(href);
    else if (typeof location !== "undefined") location.assign(href);
  }
}
