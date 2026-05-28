import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ElladaDematerialisedSecuritiesSystemView — a read-only display of Greece's Dematerialised Securities System (DSS)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `ellada-dematerialised-securities-system-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-ellada-dematerialised-securities-system-view",
  standalone: true,
  template: `<span class="ellada-dematerialised-securities-system-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElladaDematerialisedSecuritiesSystemView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
