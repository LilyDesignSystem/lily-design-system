import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * NetPromoterScoreView — a read-only display of a Net Promoter Score
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `net-promoter-score-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-net-promoter-score-view",
  standalone: true,
  template: `<span class="net-promoter-score-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetPromoterScoreView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
