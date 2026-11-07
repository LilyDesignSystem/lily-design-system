import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * KbdShortcut component
 *
 * A headless keyboard shortcut: an outer <kbd> holding one inner <kbd> per key,
 * with a decorative separator between keys. Use Kbd for a single key.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   keys — string[], required. The key names, in order, e.g. ["Ctrl", "K"].
 *   separator — string, default "+". Decorative text between keys (aria-hidden).
 *   label — string, optional. Spoken form, read instead of the visible keys.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Keyboard:
 *   - None; display only
 *
 * Accessibility:
 *   - Separators are aria-hidden so screen readers read the keys
 *   - label (optional) replaces the spoken form, e.g. "Control K": it is hidden text, and the keys are aria-hidden
 *
 * Internationalization:
 *   - Key names are consumer-supplied; no hardcoded strings
 *
 * Claude rules:
 *   - Headless: no CSS, no icons for keys
 */
@Component({
    selector: "lily-kbd-shortcut",
    standalone: true,
    template: `<kbd class="kbd-shortcut {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}@for (key of keys(); track $index) {@if ($index > 0) {<span class="kbd-shortcut-separator" aria-hidden="true">{{ separator() }}</span>}<kbd class="kbd-shortcut-key" [attr.aria-hidden]="label() ? 'true' : null">{{ key }}</kbd>}</kbd>`,
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
