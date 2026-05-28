import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * SummaryListItem — one key-value pair in a summary list
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `summary-list-item` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-summary-list-item",
  standalone: true,
  template: `<li class="summary-list-item {{ className() }}"><ng-content /></li>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryListItem {
  readonly className = input<string>("");
}
