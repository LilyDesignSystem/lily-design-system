import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ContainerWithFixedWidth — a centered content wrapper with a fixed max-width breakpoint
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `container-with-fixed-width` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-container-with-fixed-width",
  standalone: true,
  template: `<div class="container-with-fixed-width {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerWithFixedWidth {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
