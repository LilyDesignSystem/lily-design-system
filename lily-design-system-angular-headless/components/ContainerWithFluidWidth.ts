import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * ContainerWithFluidWidth — a full-width content wrapper with horizontal padding
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `container-with-fluid-width` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-container-with-fluid-width",
  standalone: true,
  template: `<div class="container-with-fluid-width {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerWithFluidWidth {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
