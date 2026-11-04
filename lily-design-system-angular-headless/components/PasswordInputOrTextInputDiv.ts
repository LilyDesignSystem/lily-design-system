import {
    ChangeDetectionStrategy,
    Component,
    input,
    ElementRef,
    OnInit,
    inject,
} from "@angular/core";
import { warnMissingName } from "./dev-warning";

/**
 * PasswordInputOrTextInputDiv — an input for entering a password <input type="password"> or text <input type="text"> with show/hide toggle
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `password-input-or-text-input-div` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-password-input-or-text-input-div",
    standalone: true,
    template: `<div class="password-input-or-text-input-div {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordInputOrTextInputDiv implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    readonly label = input<string>("");
    readonly className = input<string>("");

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
