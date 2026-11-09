import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * CareCard — a medical care instruction card with urgency levels
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `care-card` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-care-card",
    standalone: true,
    template: `<div class="care-card {{ className() }}" role="group" [attr.aria-label]="label() || heading() || null" [attr.data-type]="type()"><h2>{{ heading() }}</h2><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CareCard {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** How soon to act. */
    readonly type = input<"non-urgent" | "urgent" | "immediate">("non-urgent");
    /** Card title; also its name unless label is given. */
    readonly heading = input<string>("");
}
