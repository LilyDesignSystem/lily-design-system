import {
    ChangeDetectionStrategy,
    Component,
    input,
    model,
} from "@angular/core";
import { restoreOnFormReset } from "./form-reset";

/**
 * InputWithMask — an input displaying a format mask placeholder for the user to fill in
 *
 * Headless Angular component: the mask is shown, and exposed as data-mask; the component does not change what is typed.
 * Ships zero CSS.
 */
@Component({
    selector: "lily-input-with-mask",
    standalone: true,
    template: `<div class="input-with-mask {{ className() }}" [attr.data-mask]="mask()">
        <span class="input-with-mask-display" aria-hidden="true">{{ mask() }}</span>
        <input
            class="input-with-mask-control"
            type="text"
            [attr.aria-label]="label() || null"
            [value]="value()"
            [attr.placeholder]="placeholder() || null"
            [disabled]="disabled()"
            (input)="value.set($any($event.target).value)"
        />
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputWithMask {
    readonly label = input.required<string>();
    readonly mask = input.required<string>();
    readonly value = model<string>("");
    readonly placeholder = input<string>("");
    readonly disabled = input<boolean>(false);
    readonly className = input<string>("");

    constructor() {
        restoreOnFormReset(this.value);
    }
}
