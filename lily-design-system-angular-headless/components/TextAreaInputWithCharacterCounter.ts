import {
    ChangeDetectionStrategy,
    Component,
    computed,
    effect,
    ElementRef,
    inject,
    input,
    model,
    OnInit,
    signal,
    untracked,
} from "@angular/core";
import { restoreOnFormReset } from "./form-reset";
import { warnMissingName } from "./dev-warning";

let nextId = 0;

/**
 * TextAreaInputWithCharacterCounter — a multi-line text area input with a caption below that is a character counter "[number] of [maximum] characters"
 *
 * Headless Angular component: a textarea with a live count. `counterTemplate` is required, with {count} and {max} filled in:
 * the words are the consumer's, in the consumer's language. Ships zero CSS. The visible count is aria-hidden; a visually
 * hidden role="status" takes the same text once typing has paused for `announceDelay` ms (default 1000), so a run of
 * keystrokes is announced once.
 */
@Component({
    selector: "lily-text-area-input-with-character-counter",
    standalone: true,
    template: `<div class="text-area-input-with-character-counter {{ className() }}">
        <textarea
            [attr.aria-label]="label() || null"
            [attr.aria-describedby]="counterId"
            [attr.maxlength]="maxLength()"
            [attr.rows]="rows()"
            [attr.placeholder]="placeholder() || null"
            [required]="required()"
            [disabled]="disabled()"
            [value]="value()"
            (input)="value.set($any($event.target).value)"
        ></textarea>
        <span [attr.id]="counterId"><span aria-hidden="true">{{ counterText() }}</span><span class="screen-reader-span" role="status">{{ announced() }}</span></span>
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextAreaInputWithCharacterCounter implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    readonly label = input<string>("");
    readonly maxLength = input.required<number>();
    readonly counterTemplate = input.required<string>();
    readonly value = model<string>("");
    readonly rows = input<number | null>(null);
    readonly placeholder = input<string>("");
    readonly required = input<boolean>(false);
    readonly disabled = input<boolean>(false);
    readonly className = input<string>("");
    /** Milliseconds of quiet before the counter's status takes the new count. */
    readonly announceDelay = input<number>(1000);

    protected readonly announced = signal<string | null>(null);
    protected readonly counterId = `counter-${++nextId}`;
    protected readonly counterText = computed(() =>
        this.counterTemplate()
            .replace("{count}", String(this.value().length))
            .replace("{max}", String(this.maxLength())),
    );

    constructor() {
        restoreOnFormReset(this.value);
        // The first text is the status's at once; later ones only after announceDelay ms of quiet.
        effect((onCleanup) => {
            const next = this.counterText();
            if (untracked(this.announced) === null) {
                this.announced.set(next);
                return;
            }
            const timer = setTimeout(() => this.announced.set(next), untracked(this.announceDelay));
            onCleanup(() => clearTimeout(timer));
        });
    }

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "TextAreaInputWithCharacterCounter",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
