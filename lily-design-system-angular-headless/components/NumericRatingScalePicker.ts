import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    OnInit,
    computed,
    inject,
    input,
    model,
} from "@angular/core";
import { warnMissingName } from "./dev-warning";

let nextId = 0;

/**
 * NumericRatingScalePicker: a 0 to 10 rating such as a numeric pain rating scale (spec/healthcare-ui item 12). A fieldset
 * named by its legend, one native radio per number, the consumer's anchor words linked to the end radios. `value` is a
 * two-way model. Props: NumericRatingScalePicker.md.
 */
@Component({
    selector: "lily-numeric-rating-scale-picker",
    standalone: true,
    template: `<fieldset class="numeric-rating-scale-picker {{ className() }}"><legend class="numeric-rating-scale-picker-legend">{{ label() }}</legend>@if (minLabel()) {<span class="numeric-rating-scale-picker-min-label" [id]="id + '-min'">{{ minLabel() }}</span>}<span class="numeric-rating-scale-picker-options">@for (step of steps(); track step; let i = $index, last = $last) {<label class="numeric-rating-scale-picker-option"><input type="radio" [name]="name()" [value]="'' + step" [checked]="value() === '' + step" [required]="required() && i === 0" [attr.aria-describedby]="i === 0 && minLabel() ? id + '-min' : last && maxLabel() ? id + '-max' : null" (change)="value.set('' + step)" /> {{ step }}</label>}</span>@if (maxLabel()) {<span class="numeric-rating-scale-picker-max-label" [id]="id + '-max'">{{ maxLabel() }}</span>}</fieldset>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NumericRatingScalePicker implements OnInit {
    /** The question, rendered as the legend. */
    readonly label = input<string>("");
    readonly className = input<string>("");
    readonly min = input<number>(0);
    readonly max = input<number>(10);
    readonly minLabel = input<string>("");
    readonly maxLabel = input<string>("");
    readonly name = input<string>("rating");
    readonly required = input<boolean>(false);
    readonly value = model<string>("");
    protected readonly id = `numeric-rating-scale-picker-${++nextId}`;
    protected readonly steps = computed(() =>
        Array.from({ length: Math.max(0, this.max() - this.min() + 1) }, (_, i) => this.min() + i),
    );
    private readonly lilyHost = inject(ElementRef);

    ngOnInit(): void {
        warnMissingName(
            "NumericRatingScalePicker",
            this.label(),
            this.lilyHost.nativeElement.getAttribute("aria-labelledby"),
        );
    }
}
