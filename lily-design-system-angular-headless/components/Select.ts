import {
    ChangeDetectionStrategy,
    Component,
    input,
    model,
    ElementRef,
    OnInit,
    inject,
} from "@angular/core";
import { warnMissingName } from "./dev-warning";
import { restoreOnFormReset } from "./form-reset";

/**
 * Select — a dropdown select element for choosing one option
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `select` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-select",
    standalone: true,
    template: `<select class="select {{ className() }}" [attr.aria-label]="label() || null" [value]="value()" (change)="value.set($any($event.target).value)"><ng-content /></select>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Select implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    readonly label = input<string>("");
    readonly className = input<string>("");
    readonly value = model<string>("");
    constructor() {
        restoreOnFormReset(this.value);
    }

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "Select",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
