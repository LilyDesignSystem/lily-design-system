import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    ElementRef,
    afterNextRender,
    inject,
    input,
    model,
    OnInit,
} from "@angular/core";
import { warnMissingName, warnMissingProp } from "./dev-warning";

let nextId = 0;

export interface QuantityUnit {
    value: string;
    label: string;
    min?: number;
    max?: number;
    step?: number | "any";
}

/**
 * QuantityInputDiv: a quantity entered as a number and a unit, each unit with its own min, max and step (tasks.md P29-T8).
 * A group with a labelled number input and, for more than one unit, a labelled unit `<select>`; one unit is text linked by
 * aria-describedby. Nothing is converted. Props: QuantityInputDiv.md.
 */
@Component({
    selector: "lily-quantity-input-div",
    standalone: true,
    template: `<div class="quantity-input-div {{ className() }}" role="group" [attr.aria-label]="label()">
        <label [attr.for]="baseId() + '-magnitude'">{{ magnitudeLabel() }}</label>
        <input
            class="quantity-input-div-magnitude"
            [id]="baseId() + '-magnitude'"
            [attr.name]="name() ? name() + '-magnitude' : null"
            type="number"
            inputmode="decimal"
            [attr.min]="chosen()?.min ?? null"
            [attr.max]="chosen()?.max ?? null"
            [attr.step]="chosen()?.step ?? null"
            [value]="magnitude()"
            (input)="magnitude.set($any($event.target).value)"
            [attr.aria-describedby]="units().length === 1 ? baseId() + '-unit' : null"
            [required]="required()"
            [disabled]="disabled()"
        />
        @if (units().length > 1) {
            <label [attr.for]="baseId() + '-unit'">{{ unitLabel() }}</label>
            <select
                class="quantity-input-div-unit"
                [id]="baseId() + '-unit'"
                [attr.name]="name() ? name() + '-unit' : null"
                (change)="unit.set($any($event.target).value)"
                [required]="required()"
                [disabled]="disabled()"
            >
                @for (option of units(); track option.value) {
                    <option [value]="option.value" [selected]="option.value === currentUnit()">{{ option.label }}</option>
                }
            </select>
        } @else if (units().length === 1) {
            <span class="quantity-input-div-unit" [id]="baseId() + '-unit'">{{ units()[0].label }}</span>
            @if (name()) {
                <input type="hidden" [attr.name]="name() + '-unit'" [value]="units()[0].value" />
            }
        }
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuantityInputDiv implements OnInit {
    private readonly lilyHost = inject<ElementRef<HTMLElement>>(ElementRef);

    readonly className = input<string>("");
    /** The group's name. */
    readonly label = input<string>("");
    /** The number input's label. */
    readonly magnitudeLabel = input<string>("");
    /** The unit select's label; required when there is more than one unit. */
    readonly unitLabel = input<string>("");
    /** The units offered, each with its own limits; the first is the default. */
    readonly units = input<QuantityUnit[]>([]);
    /** The number as typed. Two-way. */
    readonly magnitude = model<string>("");
    /** The unit chosen. Two-way; "" means the first unit. */
    readonly unit = model<string>("");
    readonly name = input<string>("");
    readonly required = input<boolean>(false);
    readonly disabled = input<boolean>(false);
    readonly id = input<string>("");

    private readonly generatedId = `quantity-input-div-${++nextId}`;
    protected readonly baseId = computed(() => this.id() || this.generatedId);
    protected readonly currentUnit = computed(() => this.unit() || this.units()[0]?.value || "");
    protected readonly chosen = computed(
        () => this.units().find((u) => u.value === this.currentUnit()) ?? this.units()[0],
    );

    constructor() {
        // A form reset puts the native controls back; put the models back with them.
        const destroyRef = inject(DestroyRef);
        afterNextRender(() => {
            const form = this.lilyHost.nativeElement.closest("form");
            if (!form) return;
            const initial = { magnitude: this.magnitude(), unit: this.unit() };
            const onReset = () =>
                setTimeout(() => {
                    this.magnitude.set(initial.magnitude);
                    this.unit.set(initial.unit);
                }, 0);
            form.addEventListener("reset", onReset);
            destroyRef.onDestroy(() => form.removeEventListener("reset", onReset));
        });
    }

    ngOnInit(): void {
        const host = this.lilyHost.nativeElement;
        warnMissingName(
            "QuantityInputDiv",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
        warnMissingProp(
            "QuantityInputDiv",
            "magnitudeLabel",
            this.magnitudeLabel(),
            "the number needs a label.",
        );
        if (this.units().length > 1)
            warnMissingProp(
                "QuantityInputDiv",
                "unitLabel",
                this.unitLabel(),
                "the unit choice needs a label.",
            );
    }
}
