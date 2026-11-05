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
 * SelectWithExtras — a select dropdown with additional features like search or groups
 *
 * Headless Angular component: a select with content around it. Mark that content with the `before` or `after` attribute;
 * the rest is the options. Ships zero CSS.
 */
@Component({
    selector: "lily-select-with-extras",
    standalone: true,
    template: `<div class="select-with-extras {{ className() }}">
        <ng-content select="[before]" />
        <select
            [attr.aria-label]="label() || null"
            [required]="required()"
            [disabled]="disabled()"
            [value]="value()"
            (change)="value.set($any($event.target).value)"
        >
            <ng-content />
        </select>
        <ng-content select="[after]" />
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectWithExtras implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    readonly label = input<string>("");
    readonly value = model<string>("");
    readonly required = input<boolean>(false);
    readonly disabled = input<boolean>(false);
    readonly className = input<string>("");

    constructor() {
        restoreOnFormReset(this.value);
    }

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "SelectWithExtras",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
