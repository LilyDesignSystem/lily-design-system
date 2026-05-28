import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Panel — a generic content panel with optional heading
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `panel` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-panel",
  standalone: true,
  template: `<div class="panel {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Panel {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
