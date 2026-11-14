import { ChangeDetectionStrategy, Component, OnInit, input } from "@angular/core";
import { warnMissingProp } from "./dev-warning";

/**
 * EarlyWarningScoreView: an early warning score with its band and escalation (spec/healthcare-ui item 5). Display only:
 * it computes nothing. Props: EarlyWarningScoreView.md.
 */
@Component({
    selector: "lily-early-warning-score-view",
    standalone: true,
    template: `<span class="early-warning-score-view {{ className() }}" [attr.data-band]="band() || null">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}@if (system()) {<span class="early-warning-score-view-system">{{ system() }}</span>{{ " " }}}<span class="early-warning-score-view-score">{{ score() }}</span>@if (bandLabel()) {{{ " " }}<span class="early-warning-score-view-band">{{ bandLabel() }}</span>}@if (escalation()) {{{ " " }}<span class="early-warning-score-view-escalation">{{ escalation() }}</span>}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EarlyWarningScoreView implements OnInit {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** The score the consumer computed. */
    readonly score = input<string | number>("");
    readonly system = input<string>("");
    /** The consumer's band key, as data-band. */
    readonly band = input<string>("");
    /** The band in words; required with band. */
    readonly bandLabel = input<string>("");
    readonly escalation = input<string>("");

    ngOnInit(): void {
        if (this.band())
            warnMissingProp(
                "EarlyWarningScoreView",
                "bandLabel",
                this.bandLabel(),
                "A band needs words, not colour alone (WCAG 1.4.1).",
            );
    }
}
