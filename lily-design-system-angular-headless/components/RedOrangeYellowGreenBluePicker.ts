import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    input,
    model,
    OnInit,
} from "@angular/core";
import { restoreOnFormReset } from "./form-reset";
import { warnMissingName } from "./dev-warning";

/**
 * RedOrangeYellowGreenBluePicker — a picker for selecting a five-level color status
 *
 * Headless Angular component: a native `<select>` in the contract's `<div>`. The option names are the consumer's: the Svelte
 * component's English is not ported. A hidden empty option holds "nothing chosen". Ships zero CSS.
 */
@Component({
    selector: "lily-red-orange-yellow-green-blue-picker",
    standalone: true,
    template: `<div class="red-orange-yellow-green-blue-picker {{ className() }}">
        <select
            [attr.aria-label]="label() || null"
            [value]="value()"
            (change)="value.set($any($event.target).value)"
        >
            <option value="" hidden></option>
            <option value="red">{{ redLabel() }}</option>
            <option value="orange">{{ orangeLabel() }}</option>
            <option value="yellow">{{ yellowLabel() }}</option>
            <option value="green">{{ greenLabel() }}</option>
            <option value="blue">{{ blueLabel() }}</option>
        </select>
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RedOrangeYellowGreenBluePicker implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    readonly label = input<string>("");
    readonly redLabel = input.required<string>();
    readonly orangeLabel = input.required<string>();
    readonly yellowLabel = input.required<string>();
    readonly greenLabel = input.required<string>();
    readonly blueLabel = input.required<string>();
    readonly value = model<string>("");
    readonly className = input<string>("");

    constructor() {
        restoreOnFormReset(this.value);
    }

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "RedOrangeYellowGreenBluePicker",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
