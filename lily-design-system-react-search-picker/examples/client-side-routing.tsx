/**
 * Example 2 — Client-side routing, a custom path, and controlled text.
 *
 * `navigate` replaces the default `location.assign(href)`; pass your
 * router's push/navigate function to keep a single-page app in-app.
 * `action="/search"` sends a search for "foo" to "/search?foo".
 * `onSearch` fires with the trimmed query and the destination before
 * navigating. `value` + `onChange` make the field's text controlled.
 */
import * as React from "react";
import SearchPicker from "../SearchPicker";

export default function ClientSideRoutingSearchPicker({
    navigate,
}: {
    navigate: (href: string) => void;
}) {
    const [query, setQuery] = React.useState("");
    return (
        <SearchPicker
            label="Search this site"
            inputLabel="Search terms"
            submitLabel="Search"
            action="/search"
            value={query}
            onChange={setQuery}
            navigate={navigate}
            onSearch={(q, href) => console.info("search", q, href)}
        />
    );
}
