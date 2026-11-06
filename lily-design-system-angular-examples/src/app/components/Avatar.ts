import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Avatar — an avatar indicator that shows an avatar image or avatar text
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `avatar` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-avatar",
    standalone: true,
    template: `<div class="avatar {{ className() }}" role="img" [attr.aria-label]="alt() || null"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Avatar {
    /** Text alternative, read as the image's name. */
    readonly alt = input<string>("");
    readonly className = input<string>("");
}
