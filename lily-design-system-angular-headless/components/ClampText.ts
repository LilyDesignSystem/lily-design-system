import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ClampText — a text container that truncates content to a maximum number of lines
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `clamp-text` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-clamp-text",
    standalone: true,
    template: `<div class="clamp-text {{ className() }}" [attr.role]="label() ? 'group' : null" [attr.aria-label]="label() || null" [attr.data-lines]="lines()" [style.--clamp-text-lines]="lines()"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClampText {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** Lines shown before clamping; read by the consumer's CSS. */
    readonly lines = input<number>(2);
}
