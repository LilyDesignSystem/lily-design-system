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
  template: `<ol class="tree-list {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></ol>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeList {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
