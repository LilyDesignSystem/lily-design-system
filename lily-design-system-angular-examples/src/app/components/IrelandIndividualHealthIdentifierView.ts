import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * IrelandIndividualHealthIdentifierView — a read-only display of Ireland Individual Health Identifier (IHI) unique national healthcare identifier
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `ireland-individual-health-identifier-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-ireland-individual-health-identifier-view",
  standalone: true,
  template: `<span class="ireland-individual-health-identifier-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IrelandIndividualHealthIdentifierView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
