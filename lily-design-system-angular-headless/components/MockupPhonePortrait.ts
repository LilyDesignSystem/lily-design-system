import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * MockupPhonePortrait — a box area that looks like a mobile phone
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `mockup-phone-portrait` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-mockup-phone-portrait",
  standalone: true,
  template: `<div class="mockup-phone-portrait {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MockupPhonePortrait {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
