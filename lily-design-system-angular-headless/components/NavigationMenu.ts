import {
    afterRenderEffect,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    input,
    viewChild,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";
import { setupOverflowNavigation } from "./overflow-navigation";

/**
 * NavigationMenu — a site-wide navigation menu with links
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `navigation-menu` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 *
 * Inputs:
 *   label — accessible name (aria-label).
 *   className — appended to the root class list.
 *   overflow — boolean, default false. Overflow mode: renders the list
 *     (`<ul class="navigation-menu-list">`, so the projected content must be
 *     `<li>` items) and a hidden "More" item; a ResizeObserver moves the items
 *     that do not fit into a disclosure. Publishes `data-overflow="true"` on
 *     the root. Without JavaScript the links simply wrap. The set of items
 *     must not change while mounted (re-create the component when it does).
 *   moreLabel — the More button's accessible name. Required when `overflow`
 *     is set; no English from us.
 *
 * Keyboard (overflow mode): Enter / Space toggle the More button; Escape
 * closes the list and returns focus to the button; a click outside closes it.
 */
@Component({
    selector: "lily-navigation-menu",
    standalone: true,
    imports: [NgTemplateOutlet],
    template: `<ng-template #items><ng-content /></ng-template>
        <nav
            #root
            class="navigation-menu {{ className() }}"
            [attr.aria-label]="label() || null"
            [attr.data-overflow]="overflow() ? 'true' : null"
        >
            @if (overflow()) {
                <ul class="navigation-menu-list">
                    <ng-container [ngTemplateOutlet]="items" />
                    <li class="navigation-menu-more" hidden>
                        <button class="navigation-menu-more-button" type="button" aria-expanded="false">
                            {{ moreLabel() }}
                        </button>
                        <ul class="navigation-menu-more-list" hidden></ul>
                    </li>
                </ul>
            } @else {
                <ng-container [ngTemplateOutlet]="items" />
            }
        </nav>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationMenu {
    readonly label = input<string>("");
    readonly className = input<string>("");
    readonly overflow = input<boolean>(false);
    readonly moreLabel = input<string>("");

    private readonly root = viewChild<ElementRef<HTMLElement>>("root");

    constructor() {
        afterRenderEffect((onCleanup) => {
            const element = this.root()?.nativeElement;
            if (!this.overflow() || !element) return;
            const handle = setupOverflowNavigation(element);
            onCleanup(() => handle?.dispose());
        });
    }
}
