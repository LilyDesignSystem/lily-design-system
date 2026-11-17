import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    ElementRef,
    OnInit,
    afterNextRender,
    computed,
    inject,
    input,
    model,
    output,
    viewChild,
} from "@angular/core";
import { warnMissingName, warnMissingProp } from "./dev-warning";

/**
 * RangeFieldset — a two-thumb range <fieldset><legend><input type="range"> x2
 *
 * Headless Angular component. A `<fieldset class="range-fieldset">` with a visible
 * `<legend>` and two native range inputs on one scale, for the minimum and the maximum of a
 * span of values. The thumbs cannot cross: a thumb moved past the other stops where the
 * other is. Each input is its own form field, and a form reset puts both back
 * (tasks.md P34-T1). Keyboard: native range keys on each thumb. Ships zero CSS.
 */
@Component({
    selector: "lily-range-fieldset",
    standalone: true,
    template: `<fieldset class="range-fieldset {{ className() }}" [disabled]="disabled()">
    <legend class="range-fieldset-legend">{{ legend() }}</legend>
    <input
      #lower
      class="range-fieldset-minimum"
      type="range"
      [attr.aria-label]="minimumLabel() || null"
      [attr.name]="minimumName() || null"
      [min]="min()"
      [max]="max()"
      [step]="step()"
      [attr.value]="initialMinimum"
      [value]="lowerValue()"
      (input)="move('lower')"
    />
    <input
      #upper
      class="range-fieldset-maximum"
      type="range"
      [attr.aria-label]="maximumLabel() || null"
      [attr.name]="maximumName() || null"
      [min]="min()"
      [max]="max()"
      [step]="step()"
      [attr.value]="initialMaximum"
      [value]="upperValue()"
      (input)="move('upper')"
    />
  </fieldset>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeFieldset implements OnInit {
    /** Visible name of the whole range. */
    readonly legend = input<string>("");
    /** Accessible name of the lower thumb. */
    readonly minimumLabel = input<string>("");
    /** Accessible name of the upper thumb. */
    readonly maximumLabel = input<string>("");
    /** Lowest value either thumb can take. */
    readonly min = input<number>(0);
    /** Highest value either thumb can take. */
    readonly max = input<number>(100);
    /** Increment of both thumbs. */
    readonly step = input<number>(1);
    /** Lower value; defaults to min. Bindable. */
    readonly minimum = model<number | undefined>(undefined);
    /** Upper value; defaults to max. Bindable. */
    readonly maximum = model<number | undefined>(undefined);
    /** Form field name of the lower value. */
    readonly minimumName = input<string>("");
    /** Form field name of the upper value. */
    readonly maximumName = input<string>("");
    /** Disables both thumbs. */
    readonly disabled = input<boolean>(false);
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** Either value changed: [minimum, maximum]. */
    readonly change = output<[number, number]>();

    protected readonly lowerValue = computed(() => this.minimum() ?? this.min());
    protected readonly upperValue = computed(() => this.maximum() ?? this.max());

    /** The values a form reset returns to. */
    protected initialMinimum = 0;
    protected initialMaximum = 100;

    private readonly lower = viewChild.required<ElementRef<HTMLInputElement>>("lower");
    private readonly upper = viewChild.required<ElementRef<HTMLInputElement>>("upper");

    constructor() {
        const destroyRef = inject(DestroyRef);
        afterNextRender(() => {
            const form = this.lower().nativeElement.form;
            if (!form) return;
            // The browser restores the inputs after the reset event, so read them on the next task.
            const onReset = () =>
                setTimeout(() => {
                    this.minimum.set(Number(this.lower().nativeElement.value));
                    this.maximum.set(Number(this.upper().nativeElement.value));
                }, 0);
            form.addEventListener("reset", onReset);
            destroyRef.onDestroy(() => form.removeEventListener("reset", onReset));
        });
    }

    ngOnInit(): void {
        this.initialMinimum = this.lowerValue();
        this.initialMaximum = this.upperValue();
        warnMissingProp(
            "RangeFieldset",
            "legend",
            this.legend(),
            "The group of thumbs has no visible name.",
        );
        warnMissingName("RangeFieldset minimum", this.minimumLabel());
        warnMissingName("RangeFieldset maximum", this.maximumLabel());
    }

    protected move(which: "lower" | "upper"): void {
        const low = this.lower().nativeElement;
        const high = this.upper().nativeElement;
        if (which === "lower" && Number(low.value) > Number(high.value)) low.value = high.value;
        if (which === "upper" && Number(high.value) < Number(low.value)) high.value = low.value;
        this.minimum.set(Number(low.value));
        this.maximum.set(Number(high.value));
        this.change.emit([Number(low.value), Number(high.value)]);
    }
}
