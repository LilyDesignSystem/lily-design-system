import {
    ChangeDetectionStrategy,
    Component,
    input,
    ElementRef,
    OnInit,
    inject,
} from "@angular/core";
import { warnMissingName } from "./dev-warning";

/**
 * TextAreaInputWithCharacterCounter — a multi-line text area input with a caption below that is a character counter "[number] of [maximum] characters"
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `text-area-input-with-character-counter` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-text-area-input-with-character-counter",
    standalone: true,
    template: `<div class="text-area-input-with-character-counter {{ className() }}" [attr.aria-label]="label() || null"><ng-content /></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextAreaInputWithCharacterCounter implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    readonly label = input<string>("");
    readonly className = input<string>("");

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "TextAreaInputWithCharacterCounter",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
