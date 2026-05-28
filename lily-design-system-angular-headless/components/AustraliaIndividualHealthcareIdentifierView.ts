import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * AustraliaIndividualHealthcareIdentifierView — a read-only display of Australia's Individual Healthcare Identifier (IHI)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `australia-individual-healthcare-identifier-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-australia-individual-healthcare-identifier-view",
  standalone: true,
  template: `<span class="australia-individual-healthcare-identifier-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AustraliaIndividualHealthcareIdentifierView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
