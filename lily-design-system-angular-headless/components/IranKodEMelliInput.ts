import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";
import { restoreOnFormReset } from "./form-reset";

/**
 * IranKodEMelliInput — an input for entering Iran's National Code (Kod-e Melli)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `iran-kod-e-melli-input` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-iran-kod-e-melli-input",
    standalone: true,
    template: `<input
      class="iran-kod-e-melli-input {{ className() }}"
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
export class IranKodEMelliInput {
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
