import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Kbd — show keyboard shortcuts and key combinations in a styled inline element
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `kbd` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-kbd",
    standalone: true,
    template: `<kbd class="kbd {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}<span class="kbd-text" [attr.aria-hidden]="label() ? 'true' : null"><ng-content /></span></kbd>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Kbd {
    /** Spoken form, read instead of the visible key. */
    readonly label = input<string>("");
    readonly className = input<string>("");
}
