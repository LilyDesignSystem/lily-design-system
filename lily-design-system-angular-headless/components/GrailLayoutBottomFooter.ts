import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * GrailLayoutBottomFooter — grail layout bottom footer full width with <footer> tag
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `grail-layout-bottom-footer` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-grail-layout-bottom-footer",
  standalone: true,
  template: `<footer class="grail-layout-bottom-footer {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></footer>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrailLayoutBottomFooter {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
