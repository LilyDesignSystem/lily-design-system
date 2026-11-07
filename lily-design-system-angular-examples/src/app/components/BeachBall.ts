import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * BeachBall — a decorative animated beach ball element
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `beach-ball` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-beach-ball",
    standalone: true,
    template: `<div class="beach-ball {{ className() }}" role="status" aria-live="polite" [attr.aria-label]="label() || null" [attr.aria-busy]="active()" [attr.data-active]="active()">@if (active()) {<span aria-hidden="true"></span>}</div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BeachBall {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** Whether the work is in progress. */
    readonly active = input<boolean>(true);
}
