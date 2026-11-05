import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    input,
    model,
    OnInit,
    output,
} from "@angular/core";
import { restoreOnFormReset } from "./form-reset";
import { warnMissingName } from "./dev-warning";

/**
 * TextInputWithSearch — a single-line text input field <input type="text"> with search capability
 *
 * Headless Angular component: a search landmark with a field and a button. Enter searches instead of submitting a form.
 * Ships zero CSS.
 */
@Component({
    selector: "lily-text-input-with-search",
    standalone: true,
    template: `<div class="text-input-with-search {{ className() }}" role="search" [attr.aria-label]="label() || null">
        <input
            type="text"
            [attr.aria-label]="inputLabel() || null"
            [value]="value()"
            [attr.placeholder]="placeholder() || null"
            [required]="required()"
            [disabled]="disabled()"
            (input)="value.set($any($event.target).value)"
            (keydown.enter)="onEnter($event)"
        />
        <button
            type="button"
            [attr.aria-label]="searchLabel() || null"
            [disabled]="disabled()"
            (click)="search.emit(value())"
        >
            {{ searchLabel() }}
        </button>
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextInputWithSearch implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    readonly label = input<string>("");
    readonly inputLabel = input.required<string>();
    readonly searchLabel = input.required<string>();
    readonly value = model<string>("");
    readonly placeholder = input<string>("");
    readonly required = input<boolean>(false);
    readonly disabled = input<boolean>(false);
    readonly className = input<string>("");
    readonly search = output<string>();

    constructor() {
        restoreOnFormReset(this.value);
    }

    protected onEnter(event: Event): void {
        // Enter confirming an IME composition is not a search.
        if ((event as KeyboardEvent).isComposing) return;
        event.preventDefault();
        this.search.emit(this.value());
    }

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "TextInputWithSearch",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
