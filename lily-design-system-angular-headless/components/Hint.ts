import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Hint — hint text providing guidance for a form field
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `hint` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-hint",
    standalone: true,
    template: `<p class="hint {{ className() }}" [attr.id]="id() ?? null"><ng-content /></p>`,
    // The id belongs on the element: left on the host too it would be a duplicate.
    host: { "[attr.id]": "null" },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hint {
    readonly className = input<string>("");
    /** Id a field's aria-describedby points at. */
    readonly id = input<string | undefined>(undefined);
}
