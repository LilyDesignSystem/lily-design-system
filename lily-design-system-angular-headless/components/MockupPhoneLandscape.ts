import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * MockupPhoneLandscape — a box area that looks like a mobile phone in landscape orientation
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `mockup-phone-landscape` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-mockup-phone-landscape",
  standalone: true,
  template: `<div class="mockup-phone-landscape {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MockupPhoneLandscape {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
