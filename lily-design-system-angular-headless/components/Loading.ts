import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Loading — a loading indicator, such as text, or image, or animation
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `loading` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-loading",
  standalone: true,
  template: `<div class="loading {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Loading {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
