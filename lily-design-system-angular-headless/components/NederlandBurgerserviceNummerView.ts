import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * NederlandBurgerserviceNummerView — a read-only display of Netherlands's Burgerservicenummer (BSN)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `nederland-burgerservice-nummer-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-nederland-burgerservice-nummer-view",
  standalone: true,
  template: `<span class="nederland-burgerservice-nummer-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NederlandBurgerserviceNummerView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
