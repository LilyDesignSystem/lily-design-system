import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { NgTemplateOutlet } from "@angular/common";

/**
 * CallToAction — a prominent prompt encouraging user action
 *
 * Headless Angular component: the contract's `<a>` when `href` is given, else a `<button type="button">`; the root carries
 * the class hook, with no wrapper around it. A native click bubbles to the host, so listen with `(click)`. Ships zero CSS.
 */
@Component({
    selector: "lily-call-to-action",
    standalone: true,
    template: `<ng-template #content><ng-content /></ng-template>
        @if (href()) {
            <a class="call-to-action {{ className() }}" [attr.href]="href()" [attr.aria-label]="label() || null">
                <ng-container [ngTemplateOutlet]="content" />
            </a>
        } @else {
            <button class="call-to-action {{ className() }}" type="button" [disabled]="disabled()" [attr.aria-label]="label() || null">
                <ng-container [ngTemplateOutlet]="content" />
            </button>
        }`,
    imports: [NgTemplateOutlet],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CallToAction {
    readonly href = input<string>("");
    readonly label = input<string>("");
    readonly disabled = input<boolean>(false);
    readonly className = input<string>("");
}
