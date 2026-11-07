import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Fieldset — a group of related form fields with a legend
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `fieldset` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-fieldset",
    standalone: true,
    template: `<fieldset
        class="fieldset {{ className() }}"
        [disabled]="disabled()"
        [attr.aria-label]="label() || null"
    >
        @if (legend()) {
            <legend>{{ legend() }}</legend>
        }
        <ng-content />
    </fieldset>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Fieldset {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** The visible name of the group of fields. Prefer it to label. */
    readonly legend = input<string | undefined>(undefined);
    /** Disables every field in the group. */
    readonly disabled = input<boolean>(false);
}
