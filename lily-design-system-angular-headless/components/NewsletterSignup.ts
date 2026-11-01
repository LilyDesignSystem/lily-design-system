import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";

/**
 * NewsletterSignup — an email subscription form composition with idle, submitting, success, and error states
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `newsletter-signup` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-newsletter-signup",
    standalone: true,
    template: `<form class="newsletter-signup {{ className() }}" [attr.aria-label]="label() || null" (submit)="onSubmit($event)"><ng-content /></form>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsletterSignup {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** Emits the submit event; the native submission (a page navigation) is prevented. */
    readonly submitted = output<SubmitEvent>();

    onSubmit(event: Event): void {
        event.preventDefault();
        this.submitted.emit(event as SubmitEvent);
    }
}
