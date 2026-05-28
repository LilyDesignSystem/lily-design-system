import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * AlbaCommunityHealthIndexView — a read-only display of Scotland's Community Health Index (CHI)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `alba-community-health-index-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-alba-community-health-index-view",
  standalone: true,
  template: `<span class="alba-community-health-index-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlbaCommunityHealthIndexView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
