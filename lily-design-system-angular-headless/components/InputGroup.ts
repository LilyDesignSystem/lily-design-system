import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * InputGroup — a group wrapping an input with prefix and suffix addons
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `input-group` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-input-group",
    standalone: true,
    template: `<div class="input-group {{ className() }}" role="group" [attr.aria-label]="label() || null"><span class="input-group-prefix"><ng-content select="[prefix]" /></span><ng-content /><span class="input-group-suffix"><ng-content select="[suffix]" /></span></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputGroup {
    readonly label = input<string>("");
    readonly className = input<string>("");
}
