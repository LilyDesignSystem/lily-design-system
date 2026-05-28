import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * GrailLayoutRightAside — grail layout right aside sidebar with <aside> tag
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `grail-layout-right-aside` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-grail-layout-right-aside",
  standalone: true,
  template: `<aside class="grail-layout-right-aside {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></aside>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrailLayoutRightAside {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
