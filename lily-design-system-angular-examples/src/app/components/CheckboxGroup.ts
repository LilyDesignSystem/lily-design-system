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
 * CheckboxGroup — a group component that manages a collection of checkboxes with shared state
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `checkbox-group` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-checkbox-group",
    standalone: true,
    template: `<fieldset class="checkbox-group {{ className() }}" role="group" [disabled]="disabled()" [attr.aria-label]="label() || null"><ng-content /></fieldset>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxGroup implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    readonly label = input<string>("");
    readonly className = input<string>("");
    /** Disables every checkbox in the group. */
    readonly disabled = input<boolean>(false);

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "CheckboxGroup",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
