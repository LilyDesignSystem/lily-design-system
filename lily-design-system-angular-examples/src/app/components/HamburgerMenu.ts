import { ChangeDetectionStrategy, Component, OnInit, input } from "@angular/core";
import { warnMissingName } from "./dev-warning";

/**
 * HamburgerMenu — a toggle button that opens a mobile navigation menu
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `hamburger-menu` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-hamburger-menu",
    standalone: true,
    template: `<div class="hamburger-menu {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HamburgerMenu implements OnInit {
    readonly label = input<string>("");
    readonly className = input<string>("");

    ngOnInit(): void {
        warnMissingName("HamburgerMenu", this.label());
    }
}
