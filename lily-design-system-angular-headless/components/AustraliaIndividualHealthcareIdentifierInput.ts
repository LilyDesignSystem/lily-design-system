import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

/**
 * AustraliaIndividualHealthcareIdentifierInput — an input for entering Australia's Individual Healthcare Identifier (IHI)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `australia-individual-healthcare-identifier-input` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-australia-individual-healthcare-identifier-input",
  standalone: true,
  template: `<input
      class="australia-individual-healthcare-identifier-input {{ className() }}"
      type="text"
      [attr.aria-label]="label() || null"
      autocomplete="off"
      [value]="value()"
      (input)="value.set(($event.target as HTMLInputElement).value)"
      [disabled]="disabled()"
      [required]="required()"
    />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AustraliaIndividualHealthcareIdentifierInput {
  /** Accessible label, applied to aria-label. */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** Bindable input value. */
  readonly value = model<string>("");
  /** Whether the input is required for form submission. */
  readonly required = input<boolean>(false);
  /** Whether the input is disabled. */
  readonly disabled = input<boolean>(false);
}
