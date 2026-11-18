import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";
import { restoreOnFormReset } from "./form-reset";

/**
 * SubmitInput — a button input that submits a form <input type="submit">
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `submit-input` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-submit-input",
    standalone: true,
    template: `<input
      [attr.id]="id() ?? null"
      class="submit-input {{ className() }}"
      type="submit"
      [attr.aria-label]="label() || null"
      autocomplete="off"
      [value]="value()"
      (input)="value.set($any($event.target).value)"
      [disabled]="disabled()"
      [required]="required()"
    />`,
    host: { "[attr.id]": "null" },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmitInput {
    /** Accessible label, applied to aria-label. */
    readonly label = input<string>("");
    /** The id of the inner control, so a <label for> or lily-field inputId reaches it (the host gets none). */
    readonly id = input<string | undefined>(undefined);
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
