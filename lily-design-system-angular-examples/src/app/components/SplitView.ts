import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * SplitView — a two-panel resizable layout container with a draggable divider between them
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `split-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-split-view",
  standalone: true,
  template: `<span class="split-view {{ className() }}" role="text" [attr.aria-label]="label() || null">{{ value() }}</span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SplitView {
  /** Optional accessible label override (aria-label). */
  readonly label = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
  /** The value to display read-only. */
  readonly value = input<string>("");
}
