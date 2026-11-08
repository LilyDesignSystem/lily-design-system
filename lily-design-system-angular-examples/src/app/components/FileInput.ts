import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";
import { restoreOnFormReset } from "./form-reset";

/**
 * FileInput — an input for selecting files from the file system <input type="file">
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `file-input` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-file-input",
    standalone: true,
    template: `<input
      class="file-input {{ className() }}"
      type="file"
      [attr.aria-label]="label() || null"
      autocomplete="off"
      [value]="value()"
      (input)="value.set($any($event.target).value)"
      [disabled]="disabled()"
      [required]="required()"
      [attr.accept]="accept() || null"
      [multiple]="multiple()"
    />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileInput {
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
    /** Comma-separated accepted file types (MIME types or extensions), as in Svelte. */
    readonly accept = input<string>("");
    /** Whether several files can be chosen, as in Svelte. */
    readonly multiple = input<boolean>(false);

    constructor() {
        restoreOnFormReset(this.value);
    }
}
