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
 * EmojiCharacterRadioGroup — a fieldset radio group for selecting an emoji character
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `emoji-character-radio-group` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-emoji-character-radio-group",
    standalone: true,
    template: `<fieldset class="emoji-character-radio-group {{ className() }}" role="radiogroup" [attr.aria-label]="label() || null"><ng-content /></fieldset>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmojiCharacterRadioGroup implements OnInit {
    private readonly lilyHost = inject(ElementRef);

    readonly label = input<string>("");
    readonly className = input<string>("");

    ngOnInit(): void {
        const host: HTMLElement = this.lilyHost.nativeElement;
        warnMissingName(
            "EmojiCharacterRadioGroup",
            this.label(),
            host.getAttribute("aria-label"),
            host.getAttribute("aria-labelledby"),
        );
    }
}
