/*
    Example 3 — Replacing the ➤ glyph.

    Project an <ng-template> into <lily-share-chooser> to replace the
    default glyph. It receives the ChildArgs context — { open, url } —
    available both as $implicit and as named properties, and can be
    typed with the optional ShareChooserIcon marker directive.

    The template replaces the GLYPH ONLY. It never renders the list;
    that stays component-owned.

    Two reasons you might reach for this:

    1. Your font stack lacks U+27A4. It is an in-font arrow rather than
       a pictograph, so it is far safer than an emoji, but "safer" is
       not "guaranteed".

    2. You want visible text. An icon-only control's accessible name
       rests entirely on aria-label, with no visible fallback — and ➤ is
       not self-evidently "share" to a sighted user either. If you can
       spare the space, a word is simply better. Keep `label` supplied
       even then: it remains the button's accessible name.

    `open` lets the glyph reflect state, which is the one thing
    aria-expanded conveys to assistive technology but nothing conveys
    visually.
*/
import { ChangeDetectionStrategy, Component } from "@angular/core";
import {
    ShareChooser,
    ShareChooserIcon,
    type ShareTarget,
} from "../share-chooser.component";

@Component({
    selector: "example-custom-glyph",
    standalone: true,
    imports: [ShareChooser, ShareChooserIcon],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <!-- Visible text instead of a glyph. -->
        <lily-share-chooser
            label="Share this page"
            [targets]="targets"
            copyLabel="Copy link"
            copiedLabel="Link copied"
            copyFailedLabel="Could not copy — copy it from the address bar"
        >
            <ng-template lilyShareChooserIcon let-args>
                {{ args.open ? "Close" : "Share" }}
            </ng-template>
        </lily-share-chooser>

        <!-- A different glyph, still hidden from assistive tech: the
             accessible name comes from aria-label either way. -->
        <lily-share-chooser label="Share this page" [targets]="targets">
            <ng-template lilyShareChooserIcon>
                <span aria-hidden="true">⤴</span>
            </ng-template>
        </lily-share-chooser>
    `,
})
export class CustomGlyphExample {
    readonly targets: ShareTarget[] = [
        {
            id: "mastodon",
            label: "Mastodon",
            href: (url) =>
                `https://mastodon.social/share?text=${encodeURIComponent(url)}`,
        },
    ];
}
