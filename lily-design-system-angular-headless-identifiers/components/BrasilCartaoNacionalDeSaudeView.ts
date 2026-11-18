import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * BrasilCartaoNacionalDeSaudeView — a read-only display of Brazil's Cartão Nacional de Saúde (CNS)
 *
 * Headless Angular component. Renders the semantic HTML root with the
 * kebab-case class hook `brasil-cartao-nacional-de-saude-view` and the consumer-provided `className`.
 * Ships zero CSS; the consumer styles via the class hook.
 */
@Component({
    selector: "lily-brasil-cartao-nacional-de-saude-view",
    standalone: true,
    template: `<span class="brasil-cartao-nacional-de-saude-view {{ className() }}">@if (label()) {<span class="screen-reader-span">{{ label() + " " }}</span>}{{ value() }}</span>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrasilCartaoNacionalDeSaudeView {
    /** Hidden text naming the value, for when no visible caption does. */
    readonly label = input<string>("");
    /** Extra CSS classes appended to the base class. */
    readonly className = input<string>("");
    /** The value to display read-only. */
    readonly value = input<string>("");
}
