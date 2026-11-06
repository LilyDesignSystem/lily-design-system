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
 * CheckboxInput — a checkbox input for toggling a boolean value <input type="checkbox">
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `checkbox-input` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-checkbox-input",
    standalone: true,
    template: `<input
      class="checkbox-input {{ className() }}"
      type="checkbox"
      [attr.aria-label]="label() || null"
      autocomplete="off"
      [attr.name]="name() ?? null"
      [attr.id]="id() ?? null"
      [attr.value]="value() || null"
      [checked]="checked()"
      (change)="checked.set($any($event.target).checked)"
      [disabled]="disabled()"
      [required]="required()"
    />`,
    // The id belongs on the input: left on the host too it would be a duplicate.
    host: { "[attr.id]": "null" },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxInput implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    /** Accessible label, applied to aria-label. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** Whether the box is checked; two-way. */
    readonly checked = model<boolean>(false);
    /** Form field name. */
    readonly name = input<string | undefined>(undefined);
    /** Id of the input. */
    readonly id = input<string | undefined>(undefined);
    /** Bindable input value. */
    readonly value = model<string>("");
    /** Whether the input is required for form submission. */
    readonly required = input<boolean>(false);
    /** Whether the input is disabled. */
    readonly disabled = input<boolean>(false);

    constructor() {
        restoreOnFormReset(this.checked);
    }

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "CheckboxInput",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
