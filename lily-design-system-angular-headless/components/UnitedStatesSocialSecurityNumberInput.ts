import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

/**
 * UnitedStatesSocialSecurityNumberInput — an input for entering a US Social Security number
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `united-states-social-security-number-input` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-united-states-social-security-number-input",
  standalone: true,
  template: `<input
      class="united-states-social-security-number-input {{ className() }}"
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
export class UnitedStatesSocialSecurityNumberInput {
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
