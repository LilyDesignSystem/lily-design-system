import { ChangeDetectionStrategy, Component, computed, input, model } from "@angular/core";
import { restoreOnFormReset } from "./form-reset";

let nextId = 0;

/**
 * DateField — a structured field for entering date components
 *
 * Headless Angular component: a labelled date input, with a description and an error linked to it. Ships zero CSS.
 */
@Component({
    selector: "lily-date-field",
    standalone: true,
    template: `<div class="date-field {{ className() }}">
        <label [attr.for]="inputId()">{{ label() }}</label>
        <input
            class="date-input"
            [id]="inputId()"
            type="date"
            [value]="value()"
            [required]="required()"
            [disabled]="disabled()"
            [attr.aria-describedby]="description() ? inputId() + '-desc' : null"
            [attr.aria-invalid]="error() ? true : null"
            [attr.aria-errormessage]="error() ? inputId() + '-error' : null"
            (input)="value.set($any($event.target).value)"
        />
        @if (description()) {
            <p [id]="inputId() + '-desc'">{{ description() }}</p>
        }
        @if (error()) {
            <p [id]="inputId() + '-error'" role="alert">{{ error() }}</p>
        }
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateField {
    readonly label = input.required<string>();
    readonly value = model<string>("");
    readonly description = input<string>("");
    readonly error = input<string>("");
    readonly required = input<boolean>(false);
    readonly disabled = input<boolean>(false);
    readonly id = input<string>("");
    readonly className = input<string>("");

    private readonly generatedId = `date-field-${++nextId}`;
    protected readonly inputId = computed(() => this.id() || this.generatedId);

    constructor() {
        restoreOnFormReset(this.value);
    }
}
