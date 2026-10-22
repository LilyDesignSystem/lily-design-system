import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * TabBarButton — one tab button in a tab group
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `tab-bar-button` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
  selector: "lily-tab-bar-button",
  standalone: true,
  template: `<button
    class="tab-bar-button {{ className() }}"
    type="button"
    role="tab"
    [attr.aria-label]="label() || null"
    [attr.aria-selected]="selected()"
    [attr.aria-controls]="controls() || null"
    [attr.tabindex]="selected() ? 0 : -1"
  ><ng-content /></button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabBarButton {
  /** Optional aria-label override. */
  readonly label = input<string>("");
  /** Whether this tab is the selected one (roving tabindex: only it is tabbable). */
  readonly selected = input<boolean>(false);
  /** Id of the tab panel this tab controls. */
  readonly controls = input<string>("");
  /** Extra CSS classes appended to the base class. */
  readonly className = input<string>("");
}
