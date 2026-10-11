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
  template: `<button
    type="button"
    class="segment-group-item {{ className() }}"
    role="radio"
    [attr.aria-checked]="checked()"
    [attr.data-value]="value() || null"
    [attr.tabindex]="checked() ? 0 : -1"
    [disabled]="disabled()"
    [attr.aria-label]="label() || null"
  ><ng-content /></button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SegmentGroupItem {
  readonly label = input<string>("");
  readonly className = input<string>("");
  /** Whether this segment is selected (`aria-checked`, and the roving tab stop). */
  readonly checked = input<boolean>(false);
  /** Value associated with this segment, exposed as `data-value`. */
  readonly value = input<string>("");
  /** Whether this segment is disabled. */
  readonly disabled = input<boolean>(false);
}
