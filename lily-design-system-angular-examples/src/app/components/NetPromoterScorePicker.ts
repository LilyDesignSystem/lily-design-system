import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    input,
    model,
    OnInit,
} from "@angular/core";
import { warnMissingName } from "./dev-warning";

/**
 * NetPromoterScorePicker — a picker for selecting a 0-10 Net Promoter Score
 *
 * Headless Angular component: eleven native radios in the contract's `<div role="radiogroup">`, so the browser supplies the
 * arrow keys. Ships zero CSS.
 */
@Component({
    selector: "lily-net-promoter-score-picker",
    standalone: true,
    template: `<div class="net-promoter-score-picker {{ className() }}" role="radiogroup" [attr.aria-label]="label() || null">
        @for (score of scores; track score) {
            <label>
                <input
                    type="radio"
                    [name]="name()"
                    [value]="score"
                    [checked]="value() === score"
                    [attr.aria-label]="score"
                    (change)="value.set(score)"
                />
                {{ score }}
            </label>
        }
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NetPromoterScorePicker implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    readonly label = input<string>("");
    readonly value = model<string>("");
    readonly name = input<string>("nps");
    readonly className = input<string>("");

    protected readonly scores = Array.from({ length: 11 }, (_, score) => String(score));

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "NetPromoterScorePicker",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
