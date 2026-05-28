import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * GoToPreviousSection — a link that takes users to the previous section of the current page
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `go-to-previous-section` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-go-to-previous-section",
  standalone: true,
  template: `<div class="go-to-previous-section {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoToPreviousSection {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
