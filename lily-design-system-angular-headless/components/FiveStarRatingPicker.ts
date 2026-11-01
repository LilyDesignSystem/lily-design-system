import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";
import { restoreRadiosOnFormReset } from "./form-reset";

/**
 * FiveStarRatingPicker — a picker for selecting a 1-5 star rating using radio buttons
 *
 * Headless Angular component. Renders a `<fieldset role="radiogroup">` with
 * the kebab-case class hook `five-star-rating-picker` and the consumer-provided
 * `className`, holding five native radios (values 1 to 5) that share
 * `name`. The radios give the keys natively: Tab focuses the checked radio,
 * the arrow keys move and check, Space checks. Ships zero CSS.
 *
 * `starLabel` gives each option's text (default: the number alone, no English).
 * `value` (two-way, 0 = none) is the checked radio; a form reset restores it.
 */
@Component({
    selector: "lily-five-star-rating-picker",
    standalone: true,
    template: `<fieldset
    class="five-star-rating-picker {{ className() }}"
    role="radiogroup"
    [attr.aria-label]="label() || null"
    [disabled]="disabled()"
  >
    @for (n of options; track n) {
      <label
        ><input
          type="radio"
          [attr.name]="name()"
          [value]="n"
          [checked]="value() === n"
          (change)="value.set(n)"
        />
        {{ starLabel() ? starLabel()!(n) : n }}</label
      >
    }
  </fieldset>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FiveStarRatingPicker {
    /** Accessible name for the rating group via aria-label. */
    readonly label = input<string>("");
    /** Current rating (1-5, 0 = none). Two-way bindable. */
    readonly value = model<number>(0);
    /** Radio group name for form submission. */
    readonly name = input<string>("rating");
    /** Each option's text, e.g. (n) => `${n} stars`. Defaults to the number alone: no English default. */
    readonly starLabel = input<((star: number) => string) | undefined>(undefined);
    /** Whether the entire group is disabled. */
    readonly disabled = input<boolean>(false);
    readonly className = input<string>("");

    protected readonly options = [1, 2, 3, 4, 5];

    constructor() {
        restoreRadiosOnFormReset(this.value);
    }
}
