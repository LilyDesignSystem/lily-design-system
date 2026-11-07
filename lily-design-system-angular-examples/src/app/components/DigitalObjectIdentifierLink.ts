import { ChangeDetectionStrategy, Component, input, computed } from "@angular/core";

/**
 * DigitalObjectIdentifierLink — a permanent hyperlink for a Digital Object Identifier (DOI) to an electronic source
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `digital-object-identifier-link` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-digital-object-identifier-link",
    standalone: true,
    template: `<a class="digital-object-identifier-link {{ className() }}" [attr.href]="target()" rel="noopener noreferrer" [attr.aria-label]="label() || null"><ng-content>{{ doi() }}</ng-content></a>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DigitalObjectIdentifierLink {
    protected readonly target = computed(() =>
        this.doi() ? `https://doi.org/${this.doi()}` : this.href() || "#",
    );

    readonly href = input<string>("");
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** The identifier, such as 10.1000/182. Sets the link and its text. */
    readonly doi = input<string>("");
}
