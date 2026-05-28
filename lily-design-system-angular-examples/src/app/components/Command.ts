import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Command — a command palette for searching and executing actions
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `command` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-command",
  standalone: true,
  template: `<div class="command {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Command {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
