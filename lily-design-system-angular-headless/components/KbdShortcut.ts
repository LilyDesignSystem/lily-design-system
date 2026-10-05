import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * KbdShortcut — a keyboard shortcut made of one or more key caps, for example Ctrl plus K
 *
 * Headless Angular component. Root `<kbd class="kbd-shortcut">` holding one
 * `<kbd class="kbd-shortcut-key">` per key, with
 * `<span class="kbd-shortcut-separator" aria-hidden="true">` between keys.
 * `keys` is required; `separator` defaults to "+"; optional `label` is the
 * spoken form (aria-label on the root). Ships zero CSS.
 */
@Component({
  selector: "lily-kbd-shortcut",
  standalone: true,
  template: `<kbd class="kbd-shortcut {{ className() }}" [attr.aria-label]="label() || null">@for (key of keys(); track $index) {@if ($index > 0) {<span class="kbd-shortcut-separator" aria-hidden="true">{{ separator() }}</span>}<kbd class="kbd-shortcut-key">{{ key }}</kbd>}</kbd>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KbdShortcut {
  /** The key caps, in order. */
  readonly keys = input.required<string[]>();
  /** Text between keys (aria-hidden). */
  readonly separator = input<string>("+");
  /** Optional spoken form of the whole shortcut. */
  readonly label = input<string>("");
  readonly className = input<string>("");
}
