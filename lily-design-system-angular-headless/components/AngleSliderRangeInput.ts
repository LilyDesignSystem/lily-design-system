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
 * AngleSliderRangeInput — a range input for selecting an angle in degrees
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `angle-slider-range-input` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-angle-slider-range-input",
    standalone: true,
    template: `<input
      class="angle-slider-range-input {{ className() }}"
      type="range"
      [attr.aria-label]="label() || null"
      autocomplete="off"
      [min]="min()"
      [max]="max()"
      [step]="step()"
      [attr.name]="name() ?? null"
      [attr.id]="id() ?? null"
      [attr.aria-valuemin]="min()"
      [attr.aria-valuemax]="max()"
      [attr.aria-valuenow]="value()"
      [attr.aria-valuetext]="value() + valueTextSuffix()"
      [value]="value()"
      (input)="value.set($any($event.target).value)"
      [disabled]="disabled()"
      [required]="required()"
    />`,
    // The id belongs on the input: left on the host too it would be a duplicate.
    host: { "[attr.id]": "null" },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AngleSliderRangeInput implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    /** Accessible label, applied to aria-label. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** Smallest angle. */
    readonly min = input<number>(0);
    /** Largest angle. */
    readonly max = input<number>(360);
    /** Angle step. */
    readonly step = input<number>(1);
    /** Form field name. */
    readonly name = input<string | undefined>(undefined);
    /** Id of the input. */
    readonly id = input<string | undefined>(undefined);
    /** Appended to the value in aria-valuetext: consumer-supplied, such as " degrees". */
    readonly valueTextSuffix = input<string>("°");
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
            "AngleSliderRangeInput",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
