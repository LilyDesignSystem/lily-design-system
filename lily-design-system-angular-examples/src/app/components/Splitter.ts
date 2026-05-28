import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * Splitter — a draggable divider for resizing adjacent panels
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `splitter` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-splitter",
  standalone: true,
  template: `<div class="splitter {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Splitter {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
