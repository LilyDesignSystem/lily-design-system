import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Sheet — a panel that slides in from a screen edge as an overlay
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `sheet` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-sheet",
  standalone: true,
  template: `<div class="sheet {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sheet {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
