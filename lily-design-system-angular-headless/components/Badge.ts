import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Badge — a small label for counts, statuses, or categories
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `badge` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-badge",
    standalone: true,
    template: `<span class="badge {{ className() }}" role="status" [attr.aria-label]="label() || null" [attr.data-type]="type()"><ng-content /></span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Badge {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** The kind of status, read by the consumer's CSS. */
    readonly type = input<"default" | "info" | "success" | "warning" | "error">("default");
}
