import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TreeListItem — one item in a tree navigation list
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `tree-list-item` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-tree-list-item",
  standalone: true,
  template: `<li class="tree-list-item {{ className() }}"><ng-content /></li>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeListItem {
  readonly className = input<string>("");
}
