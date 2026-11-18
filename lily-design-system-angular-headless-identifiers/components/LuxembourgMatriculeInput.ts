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
 * LuxembourgMatriculeInput — an input for entering Luxembourg's Numéro d'Identification Nationale (Matricule)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `luxembourg-matricule-input` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-luxembourg-matricule-input",
    standalone: true,
    template: `<input
      [attr.id]="id() ?? null"
      class="luxembourg-matricule-input {{ className() }}"
      type="text"
      [attr.aria-label]="label() || null"
      autocomplete="off"
      spellcheck="false"
      [value]="value()"
      (input)="value.set($any($event.target).value)"
      [disabled]="disabled()"
      [required]="required()"
    />`,
    host: { "[attr.id]": "null" },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LuxembourgMatriculeInput implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    /** Accessible label, applied to aria-label. */
    readonly label = input<string>("");
    /** The id of the inner control, so a <label for> or lily-field inputId reaches it (the host gets none). */
    readonly id = input<string | undefined>(undefined);
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** Bindable input value. */
    readonly value = model<string>("");
    /** Whether the input is required for form submission. */
    readonly required = input<boolean>(false);
    /** Whether the input is disabled. */
    readonly disabled = input<boolean>(false);

    constructor() {
        restoreOnFormReset(this.value);
    }

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "LuxembourgMatriculeInput",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
