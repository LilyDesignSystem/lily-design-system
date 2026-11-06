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
 * FiveStarRatingPickerButton — a picker button for selecting a 1-5 star rating using radio buttons
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `five-star-rating-picker-button` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-five-star-rating-picker-button",
    standalone: true,
    template: `<button class="five-star-rating-picker-button {{ className() }}" type="button" [disabled]="disabled()" [attr.aria-pressed]="selected()" [attr.data-value]="value() ?? null" [attr.aria-label]="label() || null"><ng-content>{{ label() }}</ng-content></button>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiveStarRatingPickerButton implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    /** Optional aria-label override. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value this button picks. */
    readonly value = input<number | undefined>(undefined);
    /** Whether this choice is the selected one. */
    readonly selected = input<boolean>(false);
    /** Disables the button. */
    readonly disabled = input<boolean>(false);

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "FiveStarRatingPickerButton",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
