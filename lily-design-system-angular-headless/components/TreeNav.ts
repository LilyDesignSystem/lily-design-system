import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TreeNav — a hierarchical navigation with expandable branches
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `tree-nav` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-tree-nav",
  standalone: true,
  template: `<nav class="tree-nav {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></nav>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeNav {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
