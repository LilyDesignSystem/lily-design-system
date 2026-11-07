import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Emoji — a single emoji character with accessible name
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `emoji` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-emoji",
    standalone: true,
    template: `<span class="emoji {{ className() }}" role="img" [attr.aria-label]="label() || null"><ng-content>{{ emoji() }}</ng-content></span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Emoji {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** The emoji character. */
    readonly emoji = input<string>("");
}
