import { ChangeDetectionStrategy, Component, input } from "@angular/core";

/**
 * WarningText — a short warning shown as an icon and a bold line of text, with a visually hidden prefix supplied by the consumer
 *
 * The GOV.UK and DHCW warning-text pattern, headless. An element projected with the `icon`
 * attribute (`<span icon>!</span>`) renders inside `.warning-text-icon`, which is
 * aria-hidden; the rest of the content (the consumer's visually hidden prefix, then the text)
 * renders inside `<strong class="warning-text-text">`. Lily bundles no icon and no strings.
 * Deviations from Svelte: no rest-props spread (Angular cannot spread onto an inner element);
 * the icon wrapper is always rendered (Angular cannot detect projected content), empty when
 * nothing is projected.
 */
@Component({
    selector: "lily-warning-text",
    standalone: true,
    template: `<div class="warning-text {{ className() }}"><span class="warning-text-icon" aria-hidden="true"><ng-content select="[icon]" /></span><strong class="warning-text-text"><ng-content /></strong></div>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WarningText {
    readonly className = input<string>("");
}
