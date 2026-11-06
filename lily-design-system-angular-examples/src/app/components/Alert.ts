import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";

/**
 * Alert — a status message for important information or feedback
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `alert` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-alert",
    standalone: true,
    template: `<div
        class="alert {{ className() }}"
        [attr.role]="role()"
        [attr.aria-live]="ariaLive()"
        aria-atomic="true"
        [attr.data-type]="type()"
        [attr.aria-label]="label() || null"
    >
        @if (heading()) {
            <p><strong>{{ heading() }}</strong></p>
        }
        <ng-content />
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Alert {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** Type of alert, for consumer styling. */
    readonly type = input<string>("info");
    /** Optional heading text. */
    readonly heading = input<string | undefined>(undefined);
    /** ARIA role: "alert" interrupts, "status" waits. */
    readonly role = input<string>("alert");
    /** aria-live value; defaults to follow the role. */
    readonly live = input<string | undefined>(undefined);

    protected readonly ariaLive = computed(
        () => this.live() ?? (this.role() === "alert" ? "assertive" : "polite"),
    );
}
