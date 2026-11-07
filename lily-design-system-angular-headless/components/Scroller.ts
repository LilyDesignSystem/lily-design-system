import { ScrollerBase } from "./ScrollerBase";
import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";

/**
 * Scroller — a scrollytelling container with step-based foreground and background composition
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `scroller` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-scroller",
    standalone: true,
    imports: [ScrollerBase],
    template: `<div class="scroller {{ className() }}" [attr.role]="label() ? 'group' : null" [attr.aria-label]="label() || null">
        <div class="scroller-background" aria-live="polite"><ng-content select="[background]" /></div>
        <lily-scroller-base className="scroller-foreground" [offset]="offset()" (indexChange)="indexChange.emit($event)" (progressChange)="progressChange.emit($event)"><ng-content /></lily-scroller-base>
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Scroller {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** Where in the viewport a step triggers, from 0 at the top to 1 at the bottom. */
    readonly offset = input<number>(0.5);
    /** The active step changed. */
    readonly indexChange = output<number>();
    /** How far through the scroller the page has scrolled, from 0 to 1. */
    readonly progressChange = output<number>();
}
