import {
    ChangeDetectionStrategy,
    Component,
    input,
    model,
    ElementRef,
    OnInit,
    inject,
} from "@angular/core";
import { warnMissingName } from "./dev-warning";
import { restoreOnFormReset } from "./form-reset";

/**
 * Slider — a draggable control for selecting a value along a track
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `slider` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-slider",
    standalone: true,
    template: `<input class="slider {{ className() }}" type="range" [attr.aria-label]="label() || null" [value]="value()" [min]="min()" [max]="max()" [step]="step()" [disabled]="disabled()" (input)="onInput($event)" />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Slider implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    readonly label = input<string>("");
    readonly className = input<string>("");
    /** Current value (two-way: [(value)]). */
    readonly value = model<number>(0);
    readonly min = input<number>(0);
    readonly max = input<number>(100);
    readonly step = input<number>(1);
    readonly disabled = input<boolean>(false);

    constructor() {
        restoreOnFormReset(this.value);
    }

    onInput(event: Event): void {
        this.value.set(Number((event.target as HTMLInputElement).value));
    }

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "Slider",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
