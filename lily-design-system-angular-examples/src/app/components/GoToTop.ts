import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * GoToTop — a link that returns users to the top of a long page
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `go-to-top` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-go-to-top",
  standalone: true,
  template: `<div class="go-to-top {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoToTop {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
