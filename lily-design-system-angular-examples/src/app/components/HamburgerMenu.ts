import { ChangeDetectionStrategy, Component, OnInit, input, model } from "@angular/core";
import { warnMissingName } from "./dev-warning";

/**
 * HamburgerMenu — a toggle button that opens a mobile navigation menu
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `hamburger-menu` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 *
 * The button toggles `open`, a two-way model. The navigation content is in the DOM only while open.
 */
let nextId = 0;

@Component({
    selector: "lily-hamburger-menu",
    standalone: true,
    template: `<div class="hamburger-menu {{ className() }}">
        <button
            type="button"
            [attr.aria-label]="label() || null"
            [attr.aria-expanded]="open()"
            [attr.aria-controls]="menuId"
            (click)="open.set(!open())"
        >
            {{ label() }}
        </button>
        @if (open()) {
            <nav
                [attr.id]="menuId"
                [attr.aria-label]="label() || null"
            >
                <ng-content />
            </nav>
        }
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HamburgerMenu implements OnInit {
    readonly label = input<string>("");
    readonly className = input<string>("");
    readonly open = model<boolean>(false);

    protected readonly menuId = `hamburger-menu-${++nextId}`;

    ngOnInit(): void {
        warnMissingName("HamburgerMenu", this.label());
    }
}
