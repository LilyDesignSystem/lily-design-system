import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * SummaryList — an ordered list of key-value summary pairs
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `summary-list` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-summary-list",
  standalone: true,
  template: `<ol class="summary-list {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></ol>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryList {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
