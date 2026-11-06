import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * StatusLight — a small colored dot status indicator paired with a status label
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `status-light` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-status-light",
    standalone: true,
    template: `<span class="status-light {{ className() }}" [attr.data-variant]="variant()" role="status"><span class="status-light-dot" aria-hidden="true"></span><span class="status-light-label">{{ label() }}</span></span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusLight {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** The kind of status, read by the consumer's CSS. */
    readonly variant = input<"neutral" | "informative" | "positive" | "notice" | "negative" | "active" | "inactive">("neutral");
}
