import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";

let nextId = 0;

/**
 * ShowMore — a content region clamped to a shorter height with a button that reveals the rest
 *
 * Headless Angular component. Root `<div class="show-more">` holding
 * `.show-more-content` (id, `data-expanded`) and a native
 * `<button class="show-more-button" aria-expanded aria-controls>` whose text is
 * `moreLabel` / `lessLabel` (both required, no English default). `expanded`
 * is a bindable boolean. The clamp is consumer CSS keyed on `data-expanded`;
 * content stays in the accessibility tree. Keyboard: native button. Ships zero CSS.
 */
@Component({
  selector: "lily-show-more",
  standalone: true,
  template: `<div class="show-more {{ className() }}">
    <div class="show-more-content" [id]="contentId" [attr.data-expanded]="expanded()"><ng-content /></div>
    <button
      type="button"
      class="show-more-button"
      [attr.aria-expanded]="expanded()"
      [attr.aria-controls]="contentId"
      (click)="expanded.set(!expanded())"
    >{{ expanded() ? lessLabel() : moreLabel() }}</button>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowMore {
  /** Button text while collapsed. */
  readonly moreLabel = input.required<string>();
  /** Button text while expanded. */
  readonly lessLabel = input.required<string>();
  readonly className = input<string>("");
  /** Whether the content is expanded. Bindable. */
  readonly expanded = model<boolean>(false);

  protected readonly contentId = `show-more-${nextId++}`;
}
