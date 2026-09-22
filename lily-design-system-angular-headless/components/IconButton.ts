import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, computed, input } from "@angular/core";

/**
 * IconButton — a button containing only an icon with a required accessible label
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `icon-button` (or `baseClass`) and the consumer-
 * provided `className`. Ships zero CSS; the consumer styles via the class
 * hook.
 *
 * The `lily-icon-button` selector tag itself is `display: contents`
 * unconditionally, on every usage — it is a semantics-free structural
 * wrapper (Angular's component selector always emits a real host element;
 * there is no Svelte-`<svelte:element>`/no-wrapper-root equivalent), so it
 * must never participate in layout or box generation. This is the same
 * "structurally required inline style" exception documented in
 * spec/headless/index.md for `ThemeProvider`, applied here for the same
 * reason: composing `<lily-icon-button>` inside a consumer's own template
 * (e.g. a `*-picker` component) must not insert a visible extra box
 * between the picker's root and its real `<button>`.
 *
 * `baseClass`, `ariaHaspopup`/`ariaExpanded`/`ariaControls`, and `focus()`
 * exist specifically so a composing consumer can reproduce an exact
 * `class="{helper}-button" aria-haspopup aria-expanded aria-controls`
 * contract and call `.focus()` on the real button — Angular has no
 * generic spread-onto-inputs mechanism (see picker-bar's own contract
 * note), so these are named inputs rather than a rest-prop spread.
 *
 * `tabIndex` (added for `kanban-board`/`gantt-chart`, 2026-09-22):
 * a button composed inside a WAI-ARIA APG grid cell must not be an
 * independent Tab stop — the grid's own roving `tabindex` is the only
 * stop, and Enter/Space on the focused cell is what opens it. The
 * Svelte reference achieves this with a plain rest-prop spread
 * (`tabindex="-1"`); Angular's `IconButton` has no such mechanism, so
 * this is a named input instead, additive and defaulting to `null`
 * (no attribute — unchanged default behaviour).
 */
@Component({
  selector: "lily-icon-button",
  standalone: true,
  template: `<button
    #root
    class="{{ baseClass() }} {{ className() }}"
    type="button"
    [attr.aria-label]="label() || null"
    [attr.aria-haspopup]="ariaHaspopup() || null"
    [attr.aria-expanded]="ariaExpandedAttr()"
    [attr.aria-controls]="ariaControls() || null"
    [attr.tabindex]="tabIndex()"
    [disabled]="disabled()"
  ><ng-content /></button>`,
  host: { style: "display: contents" },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButton {
  /** Accessible label (REQUIRED for icon-only buttons in practice; enforced by convention, not the type system, to match the button's own required aria-label contract). */
  readonly label = input<string>("");
  /** Extra CSS classes appended after the base class. */
  readonly className = input<string>("");
  /** Base class token, replacing `"icon-button"` outright (not appended). */
  readonly baseClass = input<string>("icon-button");
  readonly ariaHaspopup = input<string>("");
  readonly ariaExpanded = input<boolean | null>(null);
  readonly ariaControls = input<string>("");
  /** Overrides the real button's `tabindex`. `null` (default) sets none. */
  readonly tabIndex = input<number | null>(null);
  readonly disabled = input<boolean>(false);

  @ViewChild("root") private rootRef?: ElementRef<HTMLButtonElement>;

  protected readonly ariaExpandedAttr = computed(() => {
    const v = this.ariaExpanded();
    return v === null ? null : String(v);
  });

  /** Focus the real rendered `<button>`. */
  focus(options?: FocusOptions): void {
    this.rootRef?.nativeElement.focus(options);
  }

  /**
   * The real rendered `<button>` element. `focus()` covers the common
   * case; this exists for a consumer that needs the raw node itself —
   * e.g. remembering it as a focus-restoration target, or an
   * `instanceof HTMLElement` / `.contains()` check — where a behaviour
   * method alone isn't enough.
   */
  get element(): HTMLButtonElement | undefined {
    return this.rootRef?.nativeElement;
  }
}
