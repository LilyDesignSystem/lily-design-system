import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Caption — a caption for a table or figure element
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `caption` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-caption",
  standalone: true,
  template: `<div class="caption {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Caption {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
