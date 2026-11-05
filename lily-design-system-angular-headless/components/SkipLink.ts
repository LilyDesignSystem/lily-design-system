import { ChangeDetectionStrategy, Component, OnInit, input } from "@angular/core";
import { warnMissingName } from "./dev-warning";

/**
 * SkipLink — a hidden link for keyboard users to skip to main content
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `skip-link` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-skip-link",
    standalone: true,
    template: `<a class="skip-link {{ className() }}" [attr.href]="href() || '#'" [attr.aria-label]="label() || null"><ng-content /></a>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkipLink implements OnInit {
    readonly href = input<string>("");
    readonly label = input<string>("");
    readonly className = input<string>("");

    ngOnInit(): void {
        warnMissingName("SkipLink", this.label());
    }
}
