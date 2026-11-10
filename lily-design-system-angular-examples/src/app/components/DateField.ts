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
import { warnMissingName } from "./dev-warning";

let nextId = 0;

type Part = "day" | "month" | "year";
type Parts = Record<Part, string>;

const SEQUENCES: Record<"ymd" | "dmy" | "mdy", Part[]> = {
    ymd: ["year", "month", "day"],
    dmy: ["day", "month", "year"],
    mdy: ["month", "day", "year"],
};

/** The parts of a YYYY-MM-DD value, or empty parts for anything else. */
function split(v: string): Parts {
    const m = /^(\d{1,4})-(\d{1,2})-(\d{1,2})$/.exec(v ?? "");
    return m ? { year: m[1], month: m[2], day: m[3] } : { year: "", month: "", day: "" };
}

/** YYYY-MM-DD when every part is a number, else "". The calendar check is the consumer's. */
function join(p: Parts): string {
    if (![p.year, p.month, p.day].every((x) => /^\d+$/.test(x))) return "";
    return `${p.year.padStart(4, "0")}-${p.month.padStart(2, "0")}-${p.day.padStart(2, "0")}`;
}

/**
 * DateField — a structured field for entering date components
 *
 * Headless Angular component: a date asked for as three parts, day, month and year, in a
 * `<fieldset>` named by its `<legend>`, in the consumer's `order` ("ymd", the ISO 8601 order,
 * by default), with a description and an error linked from the fieldset. `value` is
 * `YYYY-MM-DD` once all three parts are filled, else "". Every label is the consumer's.
 * Ships zero CSS.
 */
@Component({
    selector: "lily-date-field",
    standalone: true,
    template: `<fieldset
        class="date-field {{ className() }}"
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
    /** The day part's label. */
    readonly dayLabel = input.required<string>();
    /** The month part's label. */
    readonly monthLabel = input.required<string>();
    /** The year part's label. */
    readonly yearLabel = input.required<string>();
    /** The order of the parts. Default "ymd" (ISO 8601). */
    readonly order = input<"ymd" | "dmy" | "mdy">("ymd");
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
    protected readonly sequence = computed(() => SEQUENCES[this.order()] ?? SEQUENCES.ymd);
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
                if (value !== join(this.parts())) this.parts.set(split(value));
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
                    this.parts.set(split(initial));
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
    }

    protected update(part: Part, text: string): void {
        const next = { ...this.parts(), [part]: text };
        this.parts.set(next);
        this.value.set(join(next));
    }
}
