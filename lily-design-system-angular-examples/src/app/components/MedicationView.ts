import { ChangeDetectionStrategy, Component, input } from "@angular/core";

export interface MedicationNameSegment {
    text: string;
    tallMan?: boolean;
}

/**
 * MedicationView: a medicine's name, strength, form, route and frequency, none truncated (spec/healthcare-ui item 3).
 * Tall man letters come from the consumer as marked segments; Lily ships no list. Props: MedicationView.md.
 */
@Component({
    selector: "lily-medication-view",
    standalone: true,
    template: `<span class="medication-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}<span class="medication-view-name">@if (nameSegments().length) {@for (segment of nameSegments(); track $index) {@if (segment.tallMan) {<span class="medication-view-tall-man">{{ segment.text }}</span>} @else {{{ segment.text }}}}} @else {{{ name() }}}</span>@if (strength()) {{{ " " }}<span class="medication-view-strength">{{ strength() }}</span>}@if (form()) {{{ " " }}<span class="medication-view-form">{{ form() }}</span>}@if (route()) {{{ " " }}<span class="medication-view-route">{{ route() }}</span>}@if (frequency()) {{{ " " }}<span class="medication-view-frequency">{{ frequency() }}</span>}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MedicationView {
    readonly label = input<string>("");
    readonly className = input<string>("");
    readonly name = input<string>("");
    /** The name in parts, tall man letters marked; used instead of name. */
    readonly nameSegments = input<MedicationNameSegment[]>([]);
    /** The strength, formatted by the consumer. */
    readonly strength = input<string>("");
    readonly form = input<string>("");
    readonly route = input<string>("");
    readonly frequency = input<string>("");
}
