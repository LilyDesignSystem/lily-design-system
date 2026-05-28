import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CheckList — an ordered list of check list item components
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `check-list` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-check-list",
  standalone: true,
  template: `<ol class="check-list {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></ol>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckList {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
