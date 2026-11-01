import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";

/**
 * Form — a form element for collecting and submitting user data
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `form` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-form",
    standalone: true,
    template: `<form class="form {{ className() }}" [attr.aria-label]="label() || null" (submit)="onSubmit($event)"><ng-content /></form>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Form {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** Emits the submit event; the native submission (a page navigation) is prevented. */
    readonly submitted = output<SubmitEvent>();

    onSubmit(event: Event): void {
        event.preventDefault();
        this.submitted.emit(event as SubmitEvent);
    }
}
