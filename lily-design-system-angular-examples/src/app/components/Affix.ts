import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Affix — a wrapper that pins its content to a viewport position while the page scrolls
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `affix` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-affix",
  standalone: true,
  template: `<div class="affix {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Affix {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
