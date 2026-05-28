import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Popover — a floating content box anchored to a trigger element
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `popover` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-popover",
  standalone: true,
  template: `<div class="popover {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Popover {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
