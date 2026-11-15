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
 * NetPromoterScoreRadioGroup — a fieldset radio group for selecting a 0-10 Net Promoter Score
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `net-promoter-score-radio-group` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-net-promoter-score-radio-group",
    standalone: true,
    template: `<fieldset class="net-promoter-score-radio-group {{ className() }}" role="radiogroup" [attr.aria-label]="label() || null"><ng-content /></fieldset>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetPromoterScoreRadioGroup implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    readonly label = input<string>("");
    readonly className = input<string>("");

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "NetPromoterScoreRadioGroup",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
