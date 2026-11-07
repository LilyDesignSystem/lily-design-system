import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";
import { warnMissingName } from "./dev-warning";
import { restoreRadiosOnFormReset } from "./form-reset";

/**
 * RedOrangeYellowGreenBluePicker — a picker for a red/orange/yellow/green/blue status
 *
 * Headless Angular component. Renders a `<fieldset role="radiogroup">` with the kebab-case class hook
 * `red-orange-yellow-green-blue-picker` and the consumer-provided `className`, holding one native radio per status (red, orange, yellow, green, blue)
 * that share `name`, as `five-star-rating-picker` does. The radios give the keys natively: Tab focuses the checked
 * radio, the arrow keys move and check, Space checks. Ships zero CSS.
 *
 * `statusLabel` gives each option's visible text, and is required: there is no English default.
 * `value` (two-way, "" = none) is the checked radio; a form reset restores it.
 */
@Component({
    selector: "lily-red-orange-yellow-green-blue-picker",
    standalone: true,
    template: `<fieldset
    class="red-orange-yellow-green-blue-picker {{ className() }}"
    role="radiogroup"
    [attr.aria-label]="label() || null"
    [disabled]="disabled()"
  >
    @for (status of options; track status) {
      <label
        ><input
          type="radio"
          [attr.name]="name()"
          [value]="status"
          [checked]="value() === status"
          (change)="value.set(status)"
        />
        {{ statusLabel() ? statusLabel()!(status) : status }}</label
      >
    }
  </fieldset>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RedOrangeYellowGreenBluePicker {
    /** Accessible name for the group via aria-label. */
    readonly label = input<string>("");
    /** The checked status ("" = none). Two-way bindable. */
    readonly value = model<string>("");
    /** Radio group name for form submission. */
    readonly name = input<string>("status");
    /** Each option's visible text, e.g. (status) => labels[status]. Required: no English default. */
    readonly statusLabel = input<((status: string) => string) | undefined>(undefined);
    /** Whether the entire group is disabled. */
    readonly disabled = input<boolean>(false);
    readonly className = input<string>("");

    protected readonly options = ["red", "orange", "yellow", "green", "blue"];

    constructor() {
        restoreRadiosOnFormReset(this.value);
    }

    ngOnInit(): void {
        warnMissingName("RedOrangeYellowGreenBluePicker", this.label());
    }
}
