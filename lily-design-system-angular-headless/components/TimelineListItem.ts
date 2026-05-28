import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TimelineListItem — one event in a timeline list
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `timeline-list-item` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-timeline-list-item",
  standalone: true,
  template: `<li class="timeline-list-item {{ className() }}"><ng-content /></li>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineListItem {
  readonly className = input<string>("");
}
