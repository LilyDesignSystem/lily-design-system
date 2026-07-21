/*
    Example 1 — Basic usage.

    The minimum viable share button: a label, a couple of destinations,
    and the built-in copy item.

    Three things worth noticing.

    1. The destinations are YOURS. This package ships no social-network
       URLs at all — `href` is a function, so you own the endpoint and
       its encoding. Which networks belong in a product is an editorial
       and privacy decision, the share URLs change, and networks die.

    2. `copyLabel` is what makes the copy item exist. There is no
       default, because a default would be a hardcoded English string.
       If you name it, also name `copiedLabel` and `copyFailedLabel` —
       copying is silent, so without them the user gets no confirmation
       either way.

    3. `copyFailedLabel` is actionable. "Could not copy" tells the user
       nothing they can act on; naming the fallback does. Copy fails on
       plain HTTP, on a denied permission, and in browsers with no async
       clipboard — none of which are visible to the person who clicked.

    `url` is not passed, so the component shares the current page,
    resolved lazily at share time (so SSR never touches `location`).

    On a phone, pressing this opens the OS share sheet instead of the
    list — see strategy.component.ts if that difference matters to you.

    One thing this example does NOT ship, because the package ships zero
    CSS: positioning for the list. Without `position: relative` on
    .share-button and `position: absolute` on .share-button-list, the
    open list pushes page content around.
*/
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ShareButton, type ShareTarget } from "../share-button.component";

@Component({
    selector: "example-basic",
    standalone: true,
    imports: [ShareButton],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <lily-share-button
            label="Share this page"
            title="Understanding your test results"
            [targets]="targets"
            copyLabel="Copy link"
            copiedLabel="Link copied"
            copyFailedLabel="Could not copy — copy it from the address bar"
            (share)="onShare($event)"
            (copy)="onCopy($event)"
        />
    `,
})
export class BasicExample {
    readonly targets: ShareTarget[] = [
        {
            id: "mastodon",
            label: "Mastodon",
            href: (url, title) =>
                `https://mastodon.social/share?text=${encodeURIComponent(title)}%20${encodeURIComponent(url)}`,
        },
        {
            id: "email",
            label: "Email",
            href: (url, title) =>
                `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
            // mailto: hands off to the mail client; a new tab would be
            // left behind blank.
            newTab: false,
        },
    ];

    onShare(event: { targetId: string; url: string }): void {
        console.log("shared to", event.targetId, event.url);
    }

    onCopy(url: string): void {
        console.log("copied", url);
    }
}
