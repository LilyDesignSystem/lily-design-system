import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

/**
 * TreeListItem — one item in a tree navigation list
 *
 * Headless Angular component. Attribute selector on the native `<li>` —
 * the consumer writes `<li lily-tree-list-item>`, so the host element IS the
 * `<li>` with no wrapper custom element between it and its parent (a
 * wrapper broke required parent-child content-model relationships for
 * assistive technology — see spec/index.md §11.8, Angular Material's own
 * idiom for list/table sub-elements). Renders the kebab-case class hook
 * `tree-list-item` plus the consumer-provided `className` on the host. Ships
 * zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "li[lily-tree-list-item]",
  standalone: true,
  template: `<ng-content />`,
  host: {
    "[class]": '"tree-list-item " + className()',
    role: "treeitem",
    tabindex: "-1",
    "[attr.aria-expanded]": "expanded() ?? null",
    "(keydown)": "onKeydown($event)",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeListItem {
  readonly className = input<string>("");
  /** Expanded state, two-way bindable. Leave undefined for a leaf (no aria-expanded). */
  readonly expanded = model<boolean | undefined>(undefined);

  // ArrowRight/ArrowLeft (WAI-ARIA tree pattern). Only for the focused item itself, not a
  // nested one the event bubbled up from. Swapped in right-to-left layouts.
  protected onKeydown(event: KeyboardEvent): void {
    const item = event.currentTarget as HTMLElement;
    if (event.target !== item) return;
    const rtl = getComputedStyle(item).direction === "rtl";
    const open = rtl ? "ArrowLeft" : "ArrowRight";
    const close = rtl ? "ArrowRight" : "ArrowLeft";
    if (event.key === open) {
      if (this.expanded() === false) {
        event.preventDefault();
        this.expanded.set(true);
      } else if (this.expanded() === true) {
        const child = item.querySelector<HTMLElement>("[role='treeitem']");
        if (child) {
          event.preventDefault();
          child.focus();
        }
      }
    } else if (event.key === close) {
      if (this.expanded() === true) {
        event.preventDefault();
        this.expanded.set(false);
      } else {
        const parent = item.parentElement?.closest<HTMLElement>("[role='treeitem']");
        if (parent) {
          event.preventDefault();
          parent.focus();
        }
      }
    }
  }
}
