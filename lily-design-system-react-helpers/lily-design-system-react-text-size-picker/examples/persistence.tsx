"use client";

/*
    Example 3 — localStorage persistence.

    Pass `storageKey` to make the picker remember the user's choice
    across reloads. On a fresh mount the picker reads the stored slug
    and re-applies it before the user interacts. Quota / private-mode
    errors are silently swallowed.
*/

import { TextSizePicker } from "../TextSizePicker";

export function PersistenceExample() {
    return (
        <TextSizePicker
            label="Text size"
            sizes={["small", "medium", "large", "x-large"]}
            storageKey="my-app:text-size"
        />
    );
}

export default PersistenceExample;
