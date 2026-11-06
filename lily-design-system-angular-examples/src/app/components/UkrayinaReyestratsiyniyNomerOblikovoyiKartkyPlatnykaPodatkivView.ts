import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView — a read-only display of Ukraine's Реєстраційний номер облікової картки платника податків (РНОКПП)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view",
    standalone: true,
    template: `<span class="ukrayina-reyestratsiyniy-nomer-oblikovoyi-kartky-platnyka-podatkiv-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UkrayinaReyestratsiyniyNomerOblikovoyiKartkyPlatnykaPodatkivView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
