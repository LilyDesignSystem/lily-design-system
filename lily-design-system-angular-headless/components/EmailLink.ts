import { ChangeDetectionStrategy, Component, input, computed } from "@angular/core";

/**
 * EmailLink — a mailto hyperlink for an email address
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `email-link` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-email-link",
    standalone: true,
    template: `<a class="email-link {{ className() }}" [attr.href]="target()" [attr.aria-label]="label() || null"><ng-content>{{ email() }}</ng-content></a>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailLink {
    protected readonly target = computed(() =>
        this.email() ? `mailto:${this.email()}` : this.href() || "#",
    );

    readonly href = input<string>("");
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** The address. Sets the link and its text. */
    readonly email = input<string>("");
}
