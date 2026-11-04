import {
    ChangeDetectionStrategy,
    Component,
    input,
    output,
    signal,
    ElementRef,
    OnInit,
    inject,
} from "@angular/core";
import { warnMissingName } from "./dev-warning";

/**
 * SliderButton — a button with a slider that the user needs to slide to confirm
 *
 * Headless Angular component. A `<button role="slider">` whose aria-valuenow is the position, 0 to 100.
 * ArrowRight/ArrowLeft move it by `step`; Home returns it to 0; End, Enter or Space complete it (the keyboard
 * fallback for the drag). Reaching 100 emits `confirm` and resets to 0. A disabled button ignores the keys.
 * Ships zero CSS; the consumer draws the track and thumb from aria-valuenow.
 */
@Component({
    selector: "lily-slider-button",
    standalone: true,
    template: `<button
    class="slider-button {{ className() }}"
    type="button"
    role="slider"
    [attr.aria-label]="label() || null"
    [attr.aria-valuenow]="position()"
    aria-valuemin="0"
    aria-valuemax="100"
    [disabled]="disabled()"
    (keydown)="onKeydown($event)"
  ><ng-content /></button>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderButton implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    /** Accessible label describing the confirmation action. */
    readonly label = input<string>("");
    /** How far one arrow press moves the slider, in percent. */
    readonly step = input<number>(10);
    readonly disabled = input<boolean>(false);
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** Emitted when the slider reaches 100%. */
    readonly confirm = output<void>();

    protected readonly position = signal(0);

    private moveTo(next: number): void {
        if (next >= 100) {
            this.position.set(0);
            this.confirm.emit();
        } else {
            this.position.set(Math.max(0, next));
        }
    }

    protected onKeydown(event: KeyboardEvent): void {
        if (this.disabled()) return;
        switch (event.key) {
            case "ArrowRight":
                this.moveTo(this.position() + this.step());
                break;
            case "ArrowLeft":
                this.moveTo(this.position() - this.step());
                break;
            case "Home":
                this.moveTo(0);
                break;
            case "End":
            case "Enter":
            case " ":
                this.moveTo(100);
                break;
            default:
                return;
        }
        event.preventDefault();
    }

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "SliderButton",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
