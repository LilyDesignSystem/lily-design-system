import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    inject,
    input,
    OnInit,
    output,
    signal,
} from "@angular/core";
import { warnMissingName } from "./dev-warning";

/**
 * ClipboardCopyButton — a button that copies text to the clipboard
 *
 * Headless Angular component. data-copied is true for two seconds after a copy, for the consumer's CSS; the words that say
 * so are the consumer's. Copying needs a secure context and a user gesture, so listen for `copyError`. Ships zero CSS.
 */
@Component({
    selector: "lily-clipboard-copy-button",
    standalone: true,
    template: `<button
        class="clipboard-copy-button {{ className() }}"
        type="button"
        [attr.aria-label]="label() || null"
        [attr.data-copied]="copied()"
        (click)="copy()"
    ><ng-content /></button>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClipboardCopyButton implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    readonly text = input.required<string>();
    /** Accessible name. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    readonly copySuccess = output<void>();
    readonly copyError = output<unknown>();

    protected readonly copied = signal(false);
    private resetTimer: ReturnType<typeof setTimeout> | undefined;

    constructor() {
        inject(DestroyRef).onDestroy(() => clearTimeout(this.resetTimer));
    }

    protected async copy(): Promise<void> {
        try {
            await navigator.clipboard.writeText(this.text());
        } catch (error) {
            this.copyError.emit(error);
            return;
        }
        this.copied.set(true);
        this.copySuccess.emit();
        clearTimeout(this.resetTimer);
        this.resetTimer = setTimeout(() => this.copied.set(false), 2000);
    }

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "ClipboardCopyButton",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
