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
 * TimerButton — a button with a timer that will automatically click after a given amount of time
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `timer-button` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-timer-button",
    standalone: true,
    template: `<button class="timer-button {{ className() }}" type="button" [attr.aria-label]="label() || null"><ng-content /></button>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerButton implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    /** Optional aria-label override. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "TimerButton",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
