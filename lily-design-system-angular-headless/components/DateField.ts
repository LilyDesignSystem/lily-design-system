import {
    afterNextRender,
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    effect,
    ElementRef,
    inject,
    input,
    model,
    OnInit,
    signal,
    untracked,
} from "@angular/core";
import { warnMissingName, warnMissingProp } from "./dev-warning";

let nextId = 0;

type Part = "day" | "month" | "year";
type Parts = Record<Part, string>;

const SEQUENCES: Record<"ymd" | "dmy" | "mdy", Part[]> = {
    ymd: ["year", "month", "day"],
    dmy: ["day", "month", "year"],
    mdy: ["month", "day", "year"],
};

type Precision = "day" | "month" | "year";

/** The parts shown at each precision, in ISO order. */
const PARTS: Record<Precision, Part[]> = {
    day: ["year", "month", "day"],
    month: ["year", "month"],
    year: ["year"],
};

/** The parts of a value of this precision (YYYY-MM-DD, YYYY-MM or YYYY), or empty parts for anything else. */
function split(v: string | null | undefined, shown: Part[]): Parts {
    const m = /^(\d{1,4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?$/.exec(v ?? "");
    const filled = m ? [m[1], m[2], m[3]].filter((x) => x !== undefined).length : 0;
    if (!m || filled !== shown.length) return { year: "", month: "", day: "" };
    return { year: m[1], month: m[2] ?? "", day: m[3] ?? "" };
}

/** The value when every shown part is a number, else "". The calendar check is the consumer's. */
function join(p: Parts, shown: Part[]): string {
    if (!shown.every((part) => /^\d+$/.test(p[part]))) return "";
    const iso = [p.year.padStart(4, "0"), p.month.padStart(2, "0"), p.day.padStart(2, "0")];
    return iso.slice(0, shown.length).join("-");
}

/**
 * DateField — a structured field for entering date components
 *
 * Headless Angular component: a date asked for as three parts, day, month and year, in a
 * `<fieldset>` named by its `<legend>`, in the consumer's `order` ("ymd", the ISO 8601 order,
 * by default), with a description and an error linked from the fieldset. `value` is
 * `YYYY-MM-DD` once all three parts are filled, else "". `precision` "month" or "year" asks for
 * fewer parts, and the value is `YYYY-MM` or `YYYY`, never padded with an invented day or month.
 * Every label is the consumer's.
 * Ships zero CSS.
 */
@Component({
    selector: "lily-date-field",
    standalone: true,
    template: `<fieldset
        class="date-field {{ className() }}"
        [attr.data-precision]="precision() === 'day' ? null : precision()"
        [attr.aria-describedby]="describedBy()"
        [disabled]="disabled()"
    >
        <legend>{{ label() }}</legend>
        @for (part of sequence(); track part) {
            <label [attr.for]="baseId() + '-' + part">{{ labels()[part] }}</label>
            <input
                [class]="'date-field-' + part"
                [id]="baseId() + '-' + part"
                [attr.name]="name() ? name() + '-' + part : null"
                type="text"
                inputmode="numeric"
                [attr.autocomplete]="autocomplete() === 'bday' ? 'bday-' + part : null"
                [attr.maxlength]="part === 'year' ? 4 : 2"
                [value]="parts()[part]"
                [required]="required()"
                [attr.aria-invalid]="error() ? true : null"
                (input)="update(part, $any($event.target).value)"
            />
        }
        @if (description()) {
            <p [id]="baseId() + '-desc'">{{ description() }}</p>
        }
        @if (error()) {
            <p [id]="baseId() + '-error'" role="alert">{{ error() }}</p>
        }
    </fieldset>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateField implements OnInit {
    private readonly lilyHost = inject<ElementRef<HTMLElement>>(ElementRef);

    /** The legend, naming the whole date. */
    readonly label = input.required<string>();
    /** The day part's label; required when precision is "day". */
    readonly dayLabel = input<string>("");
    /** The month part's label; required unless precision is "year". */
    readonly monthLabel = input<string>("");
    /** The year part's label. */
    readonly yearLabel = input.required<string>();
    /** The order of the parts. Default "ymd" (ISO 8601). */
    readonly order = input<"ymd" | "dmy" | "mdy">("ymd");
    /** How much of the date is asked for. Default "day". */
    readonly precision = input<Precision>("day");
    /** YYYY-MM-DD once all three parts are filled, else "". Two-way. */
    readonly value = model<string>("");
    /** Base name: the parts are {name}-day, {name}-month, {name}-year. */
    readonly name = input<string>("");
    /** "bday" for a date of birth. */
    readonly autocomplete = input<"bday" | undefined>(undefined);
    readonly description = input<string>("");
    readonly error = input<string>("");
    readonly required = input<boolean>(false);
    readonly disabled = input<boolean>(false);
    /** Base id for the parts; auto-generated if omitted. */
    readonly id = input<string>("");
    readonly className = input<string>("");

    private readonly generatedId = `date-field-${++nextId}`;
    protected readonly baseId = computed(() => this.id() || this.generatedId);
    protected readonly describedBy = computed(
        () =>
            [
                this.description() ? `${this.baseId()}-desc` : "",
                this.error() ? `${this.baseId()}-error` : "",
            ]
                .filter(Boolean)
                .join(" ") || null,
    );
    protected readonly shown = computed(() => PARTS[this.precision()] ?? PARTS.day);
    protected readonly sequence = computed(() =>
        (SEQUENCES[this.order()] ?? SEQUENCES.ymd).filter((part) => this.shown().includes(part)),
    );
    protected readonly labels = computed<Parts>(() => ({
        day: this.dayLabel(),
        month: this.monthLabel(),
        year: this.yearLabel(),
    }));
    protected readonly parts = signal<Parts>({ year: "", month: "", day: "" });

    constructor() {
        effect(() => {
            // A value set from outside fills the parts; one the parts produced leaves them as typed.
            const value = this.value();
            untracked(() => {
                if (value !== join(this.parts(), this.shown()))
                    this.parts.set(split(value, this.shown()));
            });
        });
        // A form reset blanks the parts in the DOM; put the model and the parts back to the first value.
        const destroyRef = inject(DestroyRef);
        afterNextRender(() => {
            const form = this.lilyHost.nativeElement.closest("form");
            if (!form) return;
            const initial = this.value();
            let timer: ReturnType<typeof setTimeout> | undefined;
            const onReset = (event: Event) => {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    if (event.defaultPrevented) return;
                    this.value.set(initial);
                    this.parts.set(split(initial, this.shown()));
                }, 0);
            };
            form.addEventListener("reset", onReset);
            destroyRef.onDestroy(() => {
                clearTimeout(timer);
                form.removeEventListener("reset", onReset);
            });
        });
    }

    ngOnInit(): void {
        const host = this.lilyHost.nativeElement;
        warnMissingName(
            "DateField",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
        if (this.shown().includes("day"))
            warnMissingProp(
                "DateField",
                "dayLabel",
                this.dayLabel(),
                "the day part needs a label.",
            );
        if (this.shown().includes("month"))
            warnMissingProp(
                "DateField",
                "monthLabel",
                this.monthLabel(),
                "the month part needs a label.",
            );
    }

    protected update(part: Part, text: string): void {
        const next = { ...this.parts(), [part]: text };
        this.parts.set(next);
        this.value.set(join(next, this.shown()));
    }
}
