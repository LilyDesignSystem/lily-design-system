import { ChangeDetectionStrategy, Component, input } from "@angular/core";

let nextId = 0;

/**
 * ErrorSummary — a summary of all validation errors on a form
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `error-summary` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 *
 * role="alert" announces it when it appears, and tabindex="-1" lets the page move focus to it after a failed submit.
 * The title names it through aria-labelledby; with no title, label names it directly.
 */
@Component({
    selector: "lily-error-summary",
    standalone: true,
    template: `<div
        class="error-summary {{ className() }}"
        role="alert"
        tabindex="-1"
        [attr.aria-labelledby]="title() ? titleId : null"
        [attr.aria-label]="title() ? null : label() || null"
    >
        @if (title()) {
            <h2 [id]="titleId">{{ title() }}</h2>
        }
        <ng-content />
    </div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorSummary {
    readonly title = input<string>("");
    readonly label = input<string>("");
    readonly className = input<string>("");

    protected readonly titleId = `error-summary-${nextId++}`;
}
