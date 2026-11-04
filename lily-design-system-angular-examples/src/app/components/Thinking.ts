import {
    ChangeDetectionStrategy,
    Component,
    input,
    model,
    ElementRef,
    OnInit,
    inject,
} from "@angular/core";
import { warnMissingName } from "./dev-warning";

/**
 * Thinking component
 *
 * A headless disclosure for an AI assistant's reasoning / "thinking" trace,
 * built on the native <details>. Closed by default. While `streaming` the root
 * carries data-streaming and aria-busy so consumer CSS/AT know it is still filling.
 *
 * Props:
 *   className — input<string>, optional. CSS class name, added after the base class hook on the root.
 *   label — string, required. The summary text. No default.
 *   open — boolean, default false. Bindable.
 *   streaming — boolean, default false. Adds data-streaming="true" + aria-busy="true" when true.
 *   children — content. The reasoning content.
 *   (no rest props) — Angular has no spread; attributes set on <lily-x> land on the host element, not the root.
 *
 * Keyboard:
 *   - Enter / Space on the native <summary> toggles
 *
 * Accessibility:
 *   - Native details/summary semantics; aria-busy only while streaming
 *
 * Claude rules:
 *   - Headless: no CSS, no animation, no hardcoded strings
 */
@Component({
    selector: "lily-thinking",
    standalone: true,
    template: `<details
    class="thinking {{ className() }}"
    [open]="open()"
    [attr.data-streaming]="streaming() ? 'true' : null"
    [attr.aria-busy]="streaming() ? 'true' : null"
    (toggle)="open.set($any($event.target).open)"
  ><summary class="thinking-summary">{{ label() }}</summary><div class="thinking-content"><ng-content /></div></details>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Thinking implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    /** The summary text. */
    readonly label = input.required<string>();
    readonly className = input<string>("");
    /** Whether the details is open. Bindable. */
    readonly open = model<boolean>(false);
    /** True while content is still arriving. */
    readonly streaming = input<boolean>(false);

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "Thinking",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
