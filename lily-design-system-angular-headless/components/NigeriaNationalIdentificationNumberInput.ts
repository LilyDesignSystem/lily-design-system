import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";
import { restoreOnFormReset } from "./form-reset";

/**
 * NigeriaNationalIdentificationNumberInput — an input for entering Nigeria's National Identification Number (NIN)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `nigeria-national-identification-number-input` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-nigeria-national-identification-number-input",
    standalone: true,
    template: `<input
      class="nigeria-national-identification-number-input {{ className() }}"
      type="text"
      [attr.aria-label]="label() || null"
      autocomplete="off"
      [value]="value()"
      (input)="value.set($any($event.target).value)"
      [disabled]="disabled()"
      [required]="required()"
    />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NigeriaNationalIdentificationNumberInput {
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

    constructor() {
        restoreOnFormReset(this.value);
    }
}
