import { ChangeDetectionStrategy, Component, OnInit, computed, input } from "@angular/core";
import { hasWords } from "./clinical-format";
import { warnMissingProp } from "./dev-warning";

// FHIR statuses with no value to show: the consumer's words replace it (tasks.md P28-T5).
const MISSING: readonly string[] = [
    "registered",
    "cancelled",
    "masked",
    "not-recorded",
    "unavailable",
    "not-applicable",
];

/**
 * ObservationView: a read-only clinical observation or result, with unit, flag and reference range (spec/healthcare-ui
 * item 1). Shows what the consumer decided; computes no flag and no range. Props and rules: ObservationView.md.
 */
@Component({
    selector: "lily-observation-view",
    standalone: true,
    template: `<span class="observation-view {{ className() }}" [attr.data-interpretation]="withheld() || withdrawn() ? null : interpretation() || null" [attr.data-status]="status()">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}@if (withheld()) {<span class="observation-view-status">{{ statusLabel() }}</span>} @else if (withdrawn()) {<span class="observation-view-status">{{ statusLabel() }}</span>{{ " " }}<del class="observation-view-withdrawn-value"><span class="observation-view-value">{{ value() }}</span>@if (unit()) {{{ " " }}<span class="observation-view-unit">{{ unit() }}</span>}</del>} @else {<span class="observation-view-value">{{ value() }}</span>@if (unit()) {{{ " " }}<span class="observation-view-unit">{{ unit() }}</span>}@if (flagLabel()) {{{ " " }}<span class="observation-view-flag">{{ flagLabel() }}</span>}@if (range()) {{{ " " }}<span class="observation-view-range">{{ range() }}</span>}@for (named of ranges(); track named.label) {{{ " " }}<span class="observation-view-range"><span class="observation-view-range-label">{{ named.label }}</span>{{ " " }}{{ named.text }}</span>}@if (showMeter()) {{{ " " }}<meter class="observation-view-meter" aria-hidden="true" [value]="meterValue()" [min]="meterMin()" [max]="meterMax()" [attr.low]="meterLow() ?? null" [attr.high]="meterHigh() ?? null" [attr.optimum]="meterOptimum() ?? null"></meter>}@if (previousValue()) {{{ " " }}<del class="observation-view-previous-value">{{ previousValue() }}</del>@if (previousLabel()) {{{ " " }}<span class="observation-view-previous-label">{{ previousLabel() }}</span>}}@if (status() !== "final" && statusLabel()) {{{ " " }}<span class="observation-view-status">{{ statusLabel() }}</span>}}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObservationView implements OnInit {
    /** Hidden text naming the observation. */
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** The value, formatted by the consumer. */
    readonly value = input<string>("");
    /** The unit, joined to the value by a no-break space. */
    readonly unit = input<string>("");
    /** A FHIR v3 ObservationInterpretation code, rendered as data-interpretation. */
    readonly interpretation = input<string>("");
    /** The consumer's words for the flag; required when it is not normal. */
    readonly flagLabel = input<string>("");
    readonly range = input<string>("");
    /** Further named ranges, each its own -range part with a -range-label. */
    readonly ranges = input<{ label: string; text: string }[]>([]);
    /** With meterValue, meterMin and meterMax, a native <meter> shows where the value sits; aria-hidden, as the words say it. */
    readonly meterValue = input<number | undefined>(undefined);
    readonly meterMin = input<number | undefined>(undefined);
    readonly meterMax = input<number | undefined>(undefined);
    /** The reference range and best value on the meter, for the theme. */
    readonly meterLow = input<number | undefined>(undefined);
    readonly meterHigh = input<number | undefined>(undefined);
    readonly meterOptimum = input<number | undefined>(undefined);
    protected readonly showMeter = computed(
        () =>
            typeof this.meterValue() === "number" &&
            typeof this.meterMin() === "number" &&
            typeof this.meterMax() === "number",
    );
    /** A superseded value, shown in a <del>. */
    readonly previousValue = input<string>("");
    /** The consumer's words for it; required with previousValue. */
    readonly previousLabel = input<string>("");
    readonly status = input<
        | "final"
        | "registered"
        | "preliminary"
        | "amended"
        | "corrected"
        | "entered-in-error"
        | "cancelled"
        | "unknown"
        | "masked"
        | "not-recorded"
        | "unavailable"
        | "not-applicable"
    >("final");
    /** Required for any status but final: without it no value, flag, range or meter is shown. */
    readonly statusLabel = input<string>("");
    /** For an authorised history view: an entered-in-error result's former value, struck through after its words. */
    readonly showWithdrawn = input<boolean>(false);
    protected readonly withdrawn = computed(() => this.status() === "entered-in-error");
    protected readonly withheld = computed(
        () =>
            MISSING.includes(this.status()) ||
            (this.status() !== "final" && !hasWords(this.statusLabel())) ||
            (this.withdrawn() && !this.showWithdrawn()),
    );

    ngOnInit(): void {
        if (this.status() !== "final")
            warnMissingProp(
                "ObservationView",
                "statusLabel",
                this.statusLabel(),
                "A result that is not final must say so in words; without them its value is not shown.",
            );
        if (this.previousValue())
            warnMissingProp(
                "ObservationView",
                "previousLabel",
                this.previousLabel(),
                "a superseded value needs words saying it changed, since a screen reader may not announce <del>.",
            );
        if (this.interpretation() && this.interpretation() !== "N")
            warnMissingProp(
                "ObservationView",
                "flagLabel",
                this.flagLabel(),
                "An abnormal flag needs words, not colour alone (WCAG 1.4.1).",
            );
    }
}
