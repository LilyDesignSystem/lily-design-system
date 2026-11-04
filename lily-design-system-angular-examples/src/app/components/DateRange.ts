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
export class DateRange implements OnInit {
    private readonly lilyHost = inject(ElementRef);

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

    constructor() {
        restoreOnFormReset(this.start, 0);
        restoreOnFormReset(this.end, 1);
    }

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "DateRange",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
