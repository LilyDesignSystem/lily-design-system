import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TimelineList — an ordered list of chronological events or milestones
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `timeline-list` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-timeline-list",
  standalone: true,
  template: `<ol class="timeline-list {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></ol>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineList {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
