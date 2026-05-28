import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * GrailLayoutTopHeader — grail layout top header full width with <header> tag
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `grail-layout-top-header` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-grail-layout-top-header",
  standalone: true,
  template: `<header class="grail-layout-top-header {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></header>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrailLayoutTopHeader {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
