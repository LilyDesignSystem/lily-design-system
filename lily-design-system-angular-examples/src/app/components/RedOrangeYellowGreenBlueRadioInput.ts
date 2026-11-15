import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

/**
 * RedOrangeYellowGreenBlueRadioInput — a radio input for one choice of a five-level color status <input type="radio">
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `red-orange-yellow-green-blue-radio-input` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-red-orange-yellow-green-blue-radio-input",
    standalone: true,
    template: `<input
      class="red-orange-yellow-green-blue-radio-input {{ className() }}"
      type="radio"
      [attr.aria-label]="label() || null"
      autocomplete="off"
      [attr.name]="name() ?? null"
      [checked]="checked()"
      [value]="value()"
      [attr.data-value]="value() || null"
      (input)="value.set($any($event.target).value)"
      [disabled]="disabled()"
      [required]="required()"
    />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RedOrangeYellowGreenBlueRadioInput {
    /** Accessible label, applied to aria-label. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** Form field name, shared by the group. */
    readonly name = input<string | undefined>(undefined);
    /** Whether this radio is the chosen one. */
    readonly checked = input<boolean>(false);
    /** Bindable input value. */
    readonly value = model<string>("");
    /** Whether the input is required for form submission. */
    readonly required = input<boolean>(false);
    /** Whether the input is disabled. */
    readonly disabled = input<boolean>(false);
}
