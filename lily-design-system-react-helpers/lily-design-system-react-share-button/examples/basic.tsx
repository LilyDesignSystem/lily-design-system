/**
 * Example 1 — Basic usage.
 *
 * Destinations come from you, not the package: no social-network URLs
 * ship with Lily. `url` defaults to the current page, so the common case
 * needs no wiring.
 *
 * On a device with a native share sheet (most phones, Safari) the button
 * opens that instead of this list — pass strategy="list" to force the
 * list everywhere.
 */
import ShareButton, { type ShareTarget } from "../ShareButton";

const targets: ShareTarget[] = [
    {
        id: "mastodon",
        label: "Mastodon",
        href: (url, title) =>
            `https://mastodon.social/share?text=${encodeURIComponent(`${title} ${url}`)}`,
    },
    {
        id: "email",
        label: "Email",
        href: (url, title) =>
            `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
        newTab: false,
    },
];

export default function BasicShareButton() {
    return (
        <ShareButton
            label="Share this page"
            title="An article worth reading"
            targets={targets}
            copyLabel="Copy link"
            copiedLabel="Link copied"
            copyFailedLabel="Could not copy — copy it from the address bar"
        />
    );
}
