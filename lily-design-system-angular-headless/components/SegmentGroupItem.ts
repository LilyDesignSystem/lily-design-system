import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * SegmentGroupItem — one selectable segment in a segment group
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `segment-group-item` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-segment-group-item",
  standalone: true,
  template: `<div class="segment-group-item {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SegmentGroupItem {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
