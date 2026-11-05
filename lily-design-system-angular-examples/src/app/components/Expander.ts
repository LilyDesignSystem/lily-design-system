import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    inject,
    input,
    model,
    OnInit,
} from "@angular/core";
import { warnMissingName } from "./dev-warning";

let nextId = 0;

/**
 * Expander — a control that expands to reveal more content
 *
 * Headless Angular component: a button with aria-expanded and aria-controls, and a labelled region that exists only
 * while expanded. `[(expanded)]` is two-way. Use `lily-details` for the native version. Ships zero CSS.
 */
@Component({
    selector: "lily-expander",
    standalone: true,
    template: `<div class="expander {{ className() }}">
        <button
            type="button"
            [attr.aria-expanded]="expanded()"
            [attr.aria-controls]="contentId"
            (click)="expanded.set(!expanded())"
        >
            {{ label() }}
        </button>
        @if (expanded()) {
            <div [attr.id]="contentId" role="region" [attr.aria-label]="label() || null">
                <ng-content />
            </div>
        }
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Expander implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    readonly label = input<string>("");
    readonly expanded = model<boolean>(false);
    readonly className = input<string>("");

    protected readonly contentId = `expander-${++nextId}`;

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "Expander",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
