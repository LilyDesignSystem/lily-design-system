import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ReviewDate — a display of a content review date <time>
 *
 * Headless Angular component. Renders a semantic `<time>` with the
 * kebab-case class hook `review-date`, the consumer-provided `className`,
 * and a machine-readable `datetime` (ISO 8601); the projected content is the
 * human-readable, localised date text. Ships zero CSS.
 */
@Component({
  selector: "lily-review-date",
  standalone: true,
  template: `<time
    class="review-date {{ className() }}"
    [attr.aria-label]="label() || null"
    [attr.datetime]="datetime() || null"
    ><ng-content
  /></time>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewDate {
  /** Accessible label giving screen readers context for the date. */
  readonly label = input<string>("");
  /** Machine-readable date/time in ISO 8601 format. */
  readonly datetime = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
}
