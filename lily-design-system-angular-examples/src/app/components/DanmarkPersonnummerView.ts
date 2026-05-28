import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * DanmarkPersonnummerView — a read-only display of Denmark's Personnummer (CPR-nummer) (CPR)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `danmark-personnummer-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-danmark-personnummer-view",
  standalone: true,
  template: `<span class="danmark-personnummer-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DanmarkPersonnummerView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
