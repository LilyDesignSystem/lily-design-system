import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TreeLink — one link in the tree
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `tree-link` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-tree-link",
  standalone: true,
  template: `<a class="tree-link {{ className() }}" [attr.href]="href() || '#'" [attr.aria-label]="label() || null"><ng-content /></a>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeLink {
  readonly href = input<string>("");
  readonly label = input<string>("");
  readonly className = input<string>("");
}
