import { ChangeDetectionStrategy, Component, input, ElementRef, ViewChild, afterNextRender, signal } from "@angular/core";

/**
 * GovernmentIdentifier — an identifier section with a parent agency logo, agency name, and required government links
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `government-identifier` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-government-identifier",
    standalone: true,
    template: `<section class="government-identifier {{ className() }}" [attr.aria-label]="label() || null">
        <div class="government-identifier-masthead">
            @if (logoUrl()) {<img class="government-identifier-logo" [attr.src]="logoUrl()" [attr.alt]="logoAlt()" />}
            <p class="government-identifier-agency">@if (agencyHref()) {<a [attr.href]="agencyHref()">{{ agencyName() }}</a>} @else {<span>{{ agencyName() }}</span>}</p>
            @if (description()) {<p class="government-identifier-description">{{ description() }}</p>}
        </div>
        <nav #links class="government-identifier-links" [attr.aria-label]="label() || null" [hidden]="!hasLinks()"><ng-content /></nav>
    </section>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovernmentIdentifier {
    @ViewChild("links") private links?: ElementRef<HTMLElement>;
    /** An empty nav would be an empty landmark, so it hides until something is projected. */
    protected readonly hasLinks = signal(false);

    constructor() {
        afterNextRender(() => this.hasLinks.set(Boolean(this.links?.nativeElement.childNodes.length)));
    }

    readonly label = input<string>("");
    readonly className = input<string>("");
    /** Name of the agency. */
    readonly agencyName = input<string>("");
    /** Makes the name a link. */
    readonly agencyHref = input<string | undefined>(undefined);
    /** Logo address, the adopter's own. */
    readonly logoUrl = input<string | undefined>(undefined);
    /** Text alternative of the logo. */
    readonly logoAlt = input<string>("");
    /** Line about the agency. */
    readonly description = input<string | undefined>(undefined);
}
