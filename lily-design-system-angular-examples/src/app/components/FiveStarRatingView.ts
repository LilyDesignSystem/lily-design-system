import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * FiveStarRatingView — a read-only display of a five-star rating
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `five-star-rating-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-five-star-rating-view",
  standalone: true,
  template: `<span class="five-star-rating-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiveStarRatingView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
