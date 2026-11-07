import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    input,
    model,
    OnInit,
    signal,
} from "@angular/core";
import { restoreOnFormReset } from "./form-reset";
import { warnMissingName } from "./dev-warning";

/**
 * PasswordInputOrTextInputDiv — an input for entering a password <input type="password"> or text <input type="text"> with show/hide toggle
 *
 * Headless Angular component: a password input with a button that shows or hides the text. Ships zero CSS.
 */
@Component({
    selector: "lily-password-input-or-text-input-div",
    standalone: true,
    template: `<div class="password-input-or-text-input-div {{ className() }}">
        <input
            [type]="visible() ? 'text' : 'password'"
            [attr.aria-label]="label() || null"
            [value]="value()"
            [required]="required()"
            [disabled]="disabled()"
            autocomplete="current-password"
            spellcheck="false"
            (input)="value.set($any($event.target).value)"
        />
        @if (showToggle()) {
            <button
                type="button"
                [attr.aria-label]="toggleLabel()"
                [attr.aria-pressed]="visible()"
                (click)="visible.set(!visible())"
            >
                {{ toggleLabel() }}
            </button>
        }
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordInputOrTextInputDiv implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    readonly label = input<string>("");
    readonly toggleLabel = input.required<string>();
    readonly value = model<string>("");
    readonly showToggle = input<boolean>(true);
    readonly required = input<boolean>(false);
    readonly disabled = input<boolean>(false);
    readonly className = input<string>("");

    protected readonly visible = signal(false);

    constructor() {
        restoreOnFormReset(this.value);
    }

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "PasswordInputOrTextInputDiv",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
