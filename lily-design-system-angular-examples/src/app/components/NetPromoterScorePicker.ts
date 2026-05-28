import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * NetPromoterScorePicker — a picker for selecting a 0-10 Net Promoter Score
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `net-promoter-score-picker` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-net-promoter-score-picker",
  standalone: true,
  template: `<div class="net-promoter-score-picker {{ className() }}" role="radiogroup" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetPromoterScorePicker {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
