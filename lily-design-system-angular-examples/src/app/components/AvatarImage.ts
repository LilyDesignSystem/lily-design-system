import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * AvatarImage — an avatar indicator inside image such as a user photo
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `avatar-image` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-avatar-image",
    standalone: true,
    template: `<img class="avatar-image {{ className() }}" [attr.src]="src()" [attr.alt]="alt()" aria-hidden="true" />`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarImage {
    /** Image URL (required: Angular's URL sanitizer writes an empty src rather than none). */
    readonly src = input<string>("");
    /** Alternative text; empty by default because the avatar's own name labels the person. */
    readonly alt = input<string>("");
    readonly className = input<string>("");
}
