import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * StepListItem — one step in a step list with status of waiting, in progress, finished, or error
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `step-list-item` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-step-list-item",
  standalone: true,
  template: `<li class="step-list-item {{ className() }}"><ng-content /></li>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepListItem {
  readonly className = input<string>("");
}
