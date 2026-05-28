import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TreeMenu — a hierarchical tree menu with expandable branches
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `tree-menu` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-tree-menu",
  standalone: true,
  template: `<div class="tree-menu {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeMenu {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
