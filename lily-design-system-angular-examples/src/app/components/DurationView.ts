import { ChangeDetectionStrategy, Component, computed, input, OnInit } from "@angular/core";
import { htmlDuration } from "./clinical-format";
import { warnMissingProp } from "./dev-warning";

/**
 * DurationView: a length of time in the consumer's words, in a `<time>` whose datetime is the ISO 8601 duration (tasks.md
 * P29-T6). A negative duration renders its length as datetime and data-negative; years and months are no datetime.
 * Props: DurationView.md.
 */
@Component({
    selector: "lily-duration-view",
    standalone: true,
    template: `<time class="duration-view {{ className() }}" [attr.datetime]="parsed()?.datetime ?? null" [attr.data-negative]="parsed()?.negative ? '' : null">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</time>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DurationView implements OnInit {
    readonly className = input<string>("");
    /** The length of time as the consumer writes it. */
    readonly value = input<string>("");
    /** The same length as an ISO 8601 duration of days, hours, minutes and seconds, optionally negative. */
    readonly duration = input<string>("");
    /** Hidden text naming the value. */
    readonly label = input<string>("");

    protected readonly parsed = computed(() => htmlDuration(this.duration()));

    ngOnInit(): void {
        warnMissingProp(
            "DurationView",
            "value",
            this.value(),
            "a length of time needs words a person can read, never an ISO code alone.",
        );
        warnMissingProp(
            "DurationView",
            "duration",
            this.parsed()?.datetime,
            "datetime takes an ISO 8601 duration of days, hours, minutes and seconds; use age-view or plain text for years and months.",
        );
    }
}
