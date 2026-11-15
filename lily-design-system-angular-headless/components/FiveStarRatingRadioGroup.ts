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
 * FiveStarRatingRadioGroup — a fieldset radio group for selecting a 1-5 star rating
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `five-star-rating-radio-group` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-five-star-rating-radio-group",
    standalone: true,
    template: `<fieldset class="five-star-rating-radio-group {{ className() }}" role="radiogroup" [attr.aria-label]="label() || null"><ng-content /></fieldset>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiveStarRatingRadioGroup implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    readonly label = input<string>("");
    readonly className = input<string>("");

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "FiveStarRatingRadioGroup",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
