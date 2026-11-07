import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";

/**
 * DataFilterForm — a form for filtering data by criteria
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `data-filter-form` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-data-filter-form",
    standalone: true,
    template: `<form class="data-filter-form {{ className() }}" role="search" [attr.aria-label]="label() || null" (submit)="onSubmit($event)"><ng-content /></form>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataFilterForm {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** Emits the submit event; the native submission (a page navigation) is prevented. */
    readonly submitted = output<SubmitEvent>();

    onSubmit(event: Event): void {
        event.preventDefault();
        this.submitted.emit(event as SubmitEvent);
    }
}
