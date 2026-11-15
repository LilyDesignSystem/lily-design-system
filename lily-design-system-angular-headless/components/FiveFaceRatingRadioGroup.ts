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
 * FiveFaceRatingRadioGroup — a fieldset radio group for selecting a 1-5 satisfaction rating using face labels
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `five-face-rating-radio-group` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-five-face-rating-radio-group",
    standalone: true,
    template: `<fieldset class="five-face-rating-radio-group {{ className() }}" role="radiogroup" [attr.aria-label]="label() || null"><ng-content /></fieldset>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiveFaceRatingRadioGroup implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    readonly label = input<string>("");
    readonly className = input<string>("");

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "FiveFaceRatingRadioGroup",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
