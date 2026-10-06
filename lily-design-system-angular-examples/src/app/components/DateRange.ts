import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

/**
 * DateRange — paired start and end date inputs <fieldset><input type="date">
 *
 * Headless Angular component. Renders a semantic `<fieldset>` with the
 * kebab-case class hook `date-range` and the consumer-provided `className`,
 * holding two native `<input type="date">` elements (class `date-input`),
 * each with its own accessible name. Ships zero CSS.
 */
@Component({
  selector: "lily-date-range",
  standalone: true,
  template: `<fieldset class="date-range {{ className() }}" [attr.aria-label]="label() || null">
    <input
      class="date-input"
      type="date"
      [attr.aria-label]="startLabel() || null"
      [value]="start()"
      (input)="start.set($any($event.target).value)"
    />
    <input
      class="date-input"
      type="date"
      [attr.aria-label]="endLabel() || null"
      [value]="end()"
      (input)="end.set($any($event.target).value)"
    />
  </fieldset>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRange {
  /** Accessible group label, applied to the fieldset via aria-label. */
  readonly label = input<string>("");
  /** Accessible label for the start date input. */
  readonly startLabel = input<string>("");
  /** Accessible label for the end date input. */
  readonly endLabel = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** Start date, YYYY-MM-DD. Bindable. */
  readonly start = model<string>("");
  /** End date, YYYY-MM-DD. Bindable. */
  readonly end = model<string>("");
}
