import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ScreenReaderSpan — a visually hidden span of text intended for screen readers to provide more descriptive labels
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `screen-reader-span` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-screen-reader-span",
  standalone: true,
  template: `<span class="screen-reader-span {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScreenReaderSpan {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
