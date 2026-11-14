import { ChangeDetectionStrategy, Component, OnInit, computed, input } from "@angular/core";
import { warnMissingProp } from "./dev-warning";

/**
 * ObservationView: a read-only clinical observation or result, with unit, flag and reference range (spec/healthcare-ui
 * item 1). Shows what the consumer decided; computes no flag and no range. Props and rules: ObservationView.md.
 */
@Component({
    selector: "lily-observation-view",
    standalone: true,
    template: `<span class="observation-view {{ className() }}" [attr.data-interpretation]="interpretation() || null" [attr.data-status]="status()">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}@if (missing()) {<span class="observation-view-status">{{ statusLabel() }}</span>} @else {<span class="observation-view-value">{{ value() }}</span>@if (unit()) {{{ " " }}<span class="observation-view-unit">{{ unit() }}</span>}@if (flagLabel()) {{{ " " }}<span class="observation-view-flag">{{ flagLabel() }}</span>}@if (range()) {{{ " " }}<span class="observation-view-range">{{ range() }}</span>}@if (status() === "preliminary" && statusLabel()) {{{ " " }}<span class="observation-view-status">{{ statusLabel() }}</span>}}</span>`,
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
    readonly status = input<"final" | "preliminary" | "not-recorded" | "unavailable">("final");
    readonly statusLabel = input<string>("");
    protected readonly missing = computed(
        () => this.status() === "not-recorded" || this.status() === "unavailable",
    );

    ngOnInit(): void {
        if (this.status() !== "final")
            warnMissingProp(
                "ObservationView",
                "statusLabel",
                this.statusLabel(),
                "A result that is not final must say so in words.",
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
