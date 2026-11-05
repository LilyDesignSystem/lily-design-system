import {
    ChangeDetectionStrategy,
    Component,
    computed,
    ElementRef,
    inject,
    input,
    model,
    OnInit,
} from "@angular/core";
import { restoreOnFormReset } from "./form-reset";
import { warnMissingName } from "./dev-warning";

let nextId = 0;

/**
 * TextAreaInputWithCharacterCounter — a multi-line text area input with a caption below that is a character counter "[number] of [maximum] characters"
 *
 * Headless Angular component: a textarea with a live count. `counterTemplate` is required, with {count} and {max} filled in:
 * the words are the consumer's, in the consumer's language. Ships zero CSS.
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
        <span [attr.id]="counterId" aria-live="polite">{{ counterText() }}</span>
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

    protected readonly counterId = `counter-${++nextId}`;
    protected readonly counterText = computed(() =>
        this.counterTemplate()
            .replace("{count}", String(this.value().length))
            .replace("{max}", String(this.maxLength())),
    );

    constructor() {
        restoreOnFormReset(this.value);
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
