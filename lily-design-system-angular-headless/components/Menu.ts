import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    input,
    ElementRef,
    OnInit,
    inject,
} from "@angular/core";
import { warnMissingName } from "./dev-warning";
import { attachMenu } from "./menu-keys";

/**
 * Menu — a list of actions or options triggered by a button
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `menu` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-menu",
    standalone: true,
    template: `<div
    class="menu {{ className() }}"
    role="menu"
    [attr.aria-label]="label() || null"
  ><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Menu implements OnInit, AfterViewInit {
    private readonly lilyHost = inject(ElementRef);
    private readonly destroyRef = inject(DestroyRef);

    readonly label = input<string>("");
    readonly className = input<string>("");

    /** The keys, one tab stop and submenus: menu-keys.ts, the module the catalogs share. */
    ngAfterViewInit(): void {
        const root = this.lilyHost.nativeElement.querySelector("[role='menu']");
        this.destroyRef.onDestroy(attachMenu(root, "vertical"));
    }

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "Menu",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
