import {
    ChangeDetectionStrategy,
    Component,
    computed,
    input,
} from "@angular/core";

let nextId = 0;

/**
 * Field — a form field wrapper with label, input, and error message
 *
 * Headless Angular component: a label, a description, the projected control and an error. Give the control the same id as
 * `inputId`. With no `label`, project your own. Ships zero CSS.
 */
@Component({
    selector: "lily-field",
    standalone: true,
    template: `<div class="field {{ className() }}" [attr.data-required]="required() || null">
        @if (label()) {
            <label [attr.for]="fieldId()">
                {{ label() }}
                @if (required()) {
                    <span aria-hidden="true"> *</span>
                }
            </label>
        }
        @if (description()) {
            <p [id]="fieldId() + '-desc'">{{ description() }}</p>
        }
        <ng-content />
        @if (error()) {
            <p [id]="fieldId() + '-error'" role="alert">{{ error() }}</p>
        }
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Field {
    readonly label = input<string>("");
    readonly description = input<string>("");
    readonly error = input<string>("");
    readonly required = input<boolean>(false);
    readonly inputId = input<string>("");
    readonly className = input<string>("");

    private readonly generatedId = `field-${++nextId}`;
    protected readonly fieldId = computed(() => this.inputId() || this.generatedId);
}
