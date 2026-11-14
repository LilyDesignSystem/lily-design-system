import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/** AgeView: a person's age in the consumer's words, usually from ageParts() (spec/healthcare-ui item 6). Props: AgeView.md. */
@Component({
    selector: "lily-age-view",
    standalone: true,
    template: `<span class="age-view {{ className() }}" [attr.data-duration]="duration() || null">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgeView {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** The age as the consumer writes it. */
    readonly value = input<string>("");
    /** The same age as an ISO 8601 duration, as data-duration. */
    readonly duration = input<string>("");
}
