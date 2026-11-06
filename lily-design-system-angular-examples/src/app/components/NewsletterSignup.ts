import { ChangeDetectionStrategy, Component, input, output, computed } from "@angular/core";

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
    template: `<form class="newsletter-signup {{ className() }}" [attr.aria-label]="label() || null" [attr.data-state]="state()" (submit)="onSubmit($event)">
        @if (heading() || description()) {
            <header class="newsletter-signup-header">
                @if (heading()) {<h3 class="newsletter-signup-heading">{{ heading() }}</h3>}
                @if (description()) {<p class="newsletter-signup-description">{{ description() }}</p>}
            </header>
        }
        <label class="newsletter-signup-label">
            {{ emailLabel() }}
            <input class="newsletter-signup-input" type="email" [disabled]="isSubmitting()" [attr.placeholder]="emailPlaceholder() ?? null" />
        </label>
        <button class="newsletter-signup-submit" type="submit" [disabled]="isSubmitting()">{{ submitLabel() }}</button>
        <p class="newsletter-signup-success" role="status" aria-live="polite" [hidden]="state() !== 'success'">{{ successMessage() ?? "" }}</p>
        <p class="newsletter-signup-error" role="alert" [hidden]="state() !== 'error'">{{ errorMessage() ?? "" }}</p>
    </form>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsletterSignup {
    readonly label = input<string>("");
    readonly className = input<string>("");
    /** Title. */
    readonly heading = input<string | undefined>(undefined);
    /** Summary. */
    readonly description = input<string | undefined>(undefined);
    /** Visible name of the email field. */
    readonly emailLabel = input<string>("");
    /** Placeholder of the email field. */
    readonly emailPlaceholder = input<string | undefined>(undefined);
    /** Text of the submit button. */
    readonly submitLabel = input<string>("");
    /** Where the signup is. */
    readonly state = input<"idle" | "submitting" | "success" | "error">("idle");
    /** Announced on success. */
    readonly successMessage = input<string | undefined>(undefined);
    /** Announced on error. */
    readonly errorMessage = input<string | undefined>(undefined);
    /** Emits the submit event; the native submission (a page navigation) is prevented. */
    readonly submitted = output<SubmitEvent>();

    protected readonly isSubmitting = computed(() => this.state() === "submitting");

    onSubmit(event: Event): void {
        event.preventDefault();
        this.submitted.emit(event as SubmitEvent);
    }
}
