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
 * AddressInput — an input for searching or manually entering an address
 *
 * Headless Angular component. An address is several fields, so this is the contract's `<div role="group">`, named by
 * `label`, holding the consumer's labelled inputs (street, town, postal code, country, each with its own `autocomplete`
 * token). It is the one `-input` component whose root is not an `<input>`. Ships zero CSS.
 */
@Component({
    selector: "lily-address-input",
    standalone: true,
    template: `<div class="address-input {{ className() }}" role="group" [attr.aria-label]="label() || null"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressInput implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    readonly label = input<string>("");
    readonly className = input<string>("");

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "AddressInput",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
