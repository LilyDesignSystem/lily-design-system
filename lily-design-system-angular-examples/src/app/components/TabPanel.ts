import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TabPanel — a content panel associated with a tab in a tab bar
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `tab-panel` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-tab-panel",
  standalone: true,
  template: `<div class="tab-panel {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabPanel {
  readonly label = input<string>("");
  readonly className = input<string>("");
}
