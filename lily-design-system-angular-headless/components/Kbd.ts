import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Kbd — show keyboard shortcuts and key combinations in a styled inline element
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `kbd` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-kbd",
  standalone: true,
  template: `<kbd class="kbd {{ className() }}"><ng-content /></kbd>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Kbd {
  readonly className = input<string>("");
}
