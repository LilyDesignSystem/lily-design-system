import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Container — a generic block-level content container
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `container` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-container",
  standalone: true,
  template: `<div class="container {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Container {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
