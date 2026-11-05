import {
    ChangeDetectionStrategy,
    Component,
    input,
    model,
    output,
    ElementRef,
    OnInit,
    inject,
} from "@angular/core";
import { warnMissingName } from "./dev-warning";
import { restoreOnFormReset } from "./form-reset";

/**
 * TagInputDiv — an input for adding and removing tags
 *
 * Headless Angular component: a `role="group"` root with the kebab-case class hook `tag-input-div` and the
 * consumer-provided `className`, holding the consumer's tags and a text field. Enter with text emits `added` with the
 * trimmed text and clears the field; with no text it stays a normal Enter, which submits a surrounding form; during
 * an IME composition it confirms the composition. The consumer keeps the tags and projects them, with their remove
 * buttons. Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-tag-input-div",
    standalone: true,
    template: `<div
      class="tag-input-div {{ className() }}"
      role="group"
      [attr.aria-label]="label() || null"
    >
      <ng-content />
      <input
        class="tag-input-div-field"
        type="text"
        [attr.aria-label]="label() || null"
        autocomplete="off"
        [value]="value()"
        (input)="value.set($any($event.target).value)"
        (keydown)="onKeydown($event)"
        [disabled]="disabled()"
        [required]="required()"
        [attr.placeholder]="placeholder() || null"
        [attr.name]="name() || null"
      />
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagInputDiv implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    /** Accessible label, applied to aria-label on the group and the field. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** Bindable input value. */
    readonly value = model<string>("");
    /** Whether the input is required for form submission. */
    readonly required = input<boolean>(false);
    /** Whether the input is disabled. */
    readonly disabled = input<boolean>(false);
    /** The field's placeholder. */
    readonly placeholder = input<string>("");
    /** The field's name. */
    readonly name = input<string>("");
    /** Emitted with the trimmed text when Enter adds a tag. */
    readonly added = output<string>();

    constructor() {
        restoreOnFormReset(this.value);
    }

    protected onKeydown(event: KeyboardEvent): void {
        const text = this.value().trim();
        if (event.key !== "Enter" || event.isComposing || !text) return;
        event.preventDefault();
        this.added.emit(text);
        this.value.set("");
    }

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "TagInputDiv",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
