import { ChangeDetectionStrategy, Component, input, computed } from "@angular/core";

/**
 * TelLink — a tel hyperlink for a telephone number
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `tel-link` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-tel-link",
    standalone: true,
    template: `<a class="tel-link {{ className() }}" [attr.href]="target()" [attr.aria-label]="label() || null"><ng-content>{{ phone() }}</ng-content></a>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TelLink {
    protected readonly target = computed(() =>
        this.phone() ? `tel:${this.phone()}` : this.href() || "#",
    );

    readonly href = input<string>("");
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** The number. Sets the link and its text. */
    readonly phone = input<string>("");
}
