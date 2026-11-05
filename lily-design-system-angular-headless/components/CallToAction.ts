import {
    ChangeDetectionStrategy,
    Component,
    input,
} from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

/**
 * CallToAction — a prominent prompt encouraging user action
 *
 * Headless Angular component: the contract's `<div>`, which the themes style as a band, holding a link when `href` is given and
 * a button otherwise. A native click bubbles to the host, so listen with `(click)`. Ships zero CSS.
 */
@Component({
    selector: "lily-call-to-action",
    standalone: true,
    template: `<ng-template #content><ng-content /></ng-template>
        <div class="call-to-action {{ className() }}">
            @if (href()) {
                <a [attr.href]="href()" [attr.aria-label]="label() || null">
                    <ng-container [ngTemplateOutlet]="content" />
                </a>
            } @else {
                <button type="button" [disabled]="disabled()" [attr.aria-label]="label() || null">
                    <ng-container [ngTemplateOutlet]="content" />
                </button>
            }
        </div>`,
    imports: [NgTemplateOutlet],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CallToAction {
    readonly href = input<string>("");
    readonly label = input<string>("");
    readonly disabled = input<boolean>(false);
    readonly className = input<string>("");
}
