import {
    ChangeDetectionStrategy,
    Component,
    input,
    ElementRef,
    OnInit,
    inject,
} from "@angular/core";
import { warnMissingName } from "./dev-warning";

/**
 * MutuallyExclusive — a container ensuring only one option can be selected from a group
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `mutually-exclusive` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-mutually-exclusive",
    standalone: true,
    template: `<div class="mutually-exclusive {{ className() }}" [attr.role]="label() ? 'group' : null" [attr.aria-label]="label() || null"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MutuallyExclusive implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    readonly label = input<string>("");
    readonly className = input<string>("");

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "MutuallyExclusive",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
