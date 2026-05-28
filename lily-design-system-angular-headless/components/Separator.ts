import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Separator — a horizontal or vertical divider between content sections
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `separator` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-separator",
  standalone: true,
  template: `<div class="separator {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Separator {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
