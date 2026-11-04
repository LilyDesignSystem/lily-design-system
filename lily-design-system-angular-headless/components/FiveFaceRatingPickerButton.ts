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
 * FiveFaceRatingPickerButton — a picker button for selecting a 1-5 satisfaction rating using face labels
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `five-face-rating-picker-button` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-five-face-rating-picker-button",
    standalone: true,
    template: `<button class="five-face-rating-picker-button {{ className() }}" type="button" [attr.aria-label]="label() || null"><ng-content /></button>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiveFaceRatingPickerButton implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    /** Optional aria-label override. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "FiveFaceRatingPickerButton",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
