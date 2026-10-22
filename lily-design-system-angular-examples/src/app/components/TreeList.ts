import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TreeList — a hierarchical list with nested expandable items
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `tree-list` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-tree-list",
  standalone: true,
  template: `<ol
    class="tree-list {{ className() }}"
    role="tree"
    [attr.aria-label]="label() || null"
    (keydown)="onKeydown($event)"
  ><ng-content /></ol>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeList {
  readonly label = input<string>("");
  readonly className = input<string>("");

  /** Focus moves over the `role="treeitem"` descendants (up/down, wrapping; Home/End). */
  protected onKeydown(event: KeyboardEvent): void {
    const root = event.currentTarget as HTMLElement;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[role='treeitem']")).filter((el) => !el.parentElement?.closest("[role='treeitem'][aria-expanded='false']"));
    const index = items.indexOf(document.activeElement as HTMLElement);
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        items[index < items.length - 1 ? index + 1 : 0]?.focus();
        break;
      case "ArrowUp":
        event.preventDefault();
        items[index > 0 ? index - 1 : items.length - 1]?.focus();
        break;
      case "Home":
        event.preventDefault();
        items[0]?.focus();
        break;
      case "End":
        event.preventDefault();
        items[items.length - 1]?.focus();
        break;
    }
  }
}
