import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * InputWithMask — an input displaying a format mask placeholder for the user to fill in
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `input-with-mask` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-input-with-mask",
  standalone: true,
  template: `<div class="input-with-mask {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputWithMask {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
