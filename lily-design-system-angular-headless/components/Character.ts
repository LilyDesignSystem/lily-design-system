import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Character — a single character display element
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `character` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-character",
    standalone: true,
    template: `<span class="character {{ className() }}" [attr.role]="decorative() ? 'presentation' : 'img'" [attr.aria-label]="decorative() ? null : label() || null" [attr.aria-hidden]="decorative() ? 'true' : null"><ng-content /></span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Character {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** Hides it from assistive technology. */
    readonly decorative = input<boolean>(false);
}
