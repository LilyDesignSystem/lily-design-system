import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Pictogram — an icon-based component pairing an icon with a title and description in a centered or side layout
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `pictogram` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-pictogram",
  standalone: true,
  template: `<div class="pictogram {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pictogram {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
