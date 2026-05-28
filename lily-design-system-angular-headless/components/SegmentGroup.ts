import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * SegmentGroup — a group of mutually exclusive segment options
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `segment-group` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-segment-group",
  standalone: true,
  template: `<div class="segment-group {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SegmentGroup {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
