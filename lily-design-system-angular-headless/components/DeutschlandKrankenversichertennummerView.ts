import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * DeutschlandKrankenversichertennummerView — a read-only display of Germany's Krankenversichertennummer (KVNR)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `deutschland-krankenversichertennummer-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-deutschland-krankenversichertennummer-view",
  standalone: true,
  template: `<span class="deutschland-krankenversichertennummer-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeutschlandKrankenversichertennummerView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
