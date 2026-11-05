import {
    afterNextRender,
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    inject,
    input,
    OnInit,
    output,
    PLATFORM_ID,
    signal,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { warnMissingName } from "./dev-warning";

/**
 * TimerButton — a button with a timer that will automatically click after a given amount of time
 *
 * Headless Angular component: the action runs once, when the countdown ends or when the button is pressed first. The countdown
 * starts in the browser after the first render, and data-remaining-seconds carries it. Ships zero CSS.
 */
@Component({
    selector: "lily-timer-button",
    standalone: true,
    template: `<button
        class="timer-button {{ className() }}"
        type="button"
        [attr.aria-label]="label() || null"
        aria-live="polite"
        [attr.data-remaining-seconds]="remaining()"
        [disabled]="disabled()"
        (click)="press()"
    ><ng-content /></button>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimerButton implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    /** Accessible name. */
    readonly label = input<string>("");
    /** Countdown in seconds. */
    readonly duration = input.required<number>();
    readonly disabled = input<boolean>(false);
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** Once: when the countdown ends, or when the button is pressed first. */
    readonly fired = output<void>();

    protected readonly remaining = signal(0);
    private done = false;
    private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
    private timer: ReturnType<typeof setInterval> | undefined;

    constructor() {
        afterNextRender(() => this.start());
        inject(DestroyRef).onDestroy(() => clearInterval(this.timer));
    }

    private start(): void {
        const duration = this.duration();
        this.remaining.set(duration);
        // afterNextRender also runs while prerendering: a server must not count down.
        if (this.disabled() || !this.browser) return;
        const started = Date.now();
        this.timer = setInterval(() => {
            this.remaining.set(Math.max(0, duration - Math.floor((Date.now() - started) / 1000)));
            if (this.remaining() === 0) this.fire();
        }, 250);
    }

    private fire(): void {
        if (this.done) return;
        this.done = true;
        clearInterval(this.timer);
        this.fired.emit();
    }

    protected press(): void {
        if (!this.disabled()) this.fire();
    }

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
