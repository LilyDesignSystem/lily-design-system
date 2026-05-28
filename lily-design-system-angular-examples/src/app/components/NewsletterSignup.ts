import { ChangeDetectionStrategy, Component, input } from "@angular/core";

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
  template: `<div class="newsletter-signup {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewsletterSignup {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
