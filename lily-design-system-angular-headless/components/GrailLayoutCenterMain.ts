import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * GrailLayoutCenterMain — grail layout center main content with <main> tag
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `grail-layout-center-main` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-grail-layout-center-main",
  standalone: true,
  template: `<main class="grail-layout-center-main {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></main>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrailLayoutCenterMain {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
