/**
 * Example 2 — Replacing the glyph.
 *
 * `children` is a render prop, not a node. It replaces the glyph inside
 * the trigger and receives `{ open, url }`, so the button can reflect
 * the list state. It does NOT render the list — the component owns that.
 *
 * Reach for this when your font stack lacks ➤ (U+27A4), or when you have
 * an icon system of your own. The accessible name still comes from
 * `label`, so whatever you render stays decorative.
 */
import ShareChooser, { type ShareTarget } from "../ShareChooser";

const targets: ShareTarget[] = [
    {
        id: "email",
        label: "Email",
        href: (url, title) =>
            `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
        newTab: false,
    },
];

export default function CustomGlyphShareChooser() {
    return (
        <ShareChooser
            label="Share this page"
            title="An article worth reading"
            targets={targets}
            strategy="list"
            copyLabel="Copy link"
            copiedLabel="Link copied"
            copyFailedLabel="Could not copy — copy it from the address bar"
        >
            {({ open }) => (
                <span aria-hidden="true" data-open={open ? "" : undefined}>
                    {open ? "▾" : "▸"}
                </span>
            )}
        </ShareChooser>
    );
}
