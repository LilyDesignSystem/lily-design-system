/**
 * Example 1 — Basic usage.
 *
 * A search for "foo" performs a GET to "/?foo". Every user-facing string
 * is a prop: the trigger, the field, and the ⏎ button each get a
 * localisable accessible name.
 */
import SearchPicker from "../SearchPicker";

export default function BasicSearchPicker() {
    return (
        <SearchPicker
            label="Search this site"
            inputLabel="Search terms"
            submitLabel="Search"
            placeholder="Search…"
        />
    );
}
