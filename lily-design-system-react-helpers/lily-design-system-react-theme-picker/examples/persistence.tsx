"use client";

/*
    Example 3 — localStorage persistence.

    Pass `storageKey` to make the picker remember the user's choice across
    reloads. On a fresh mount the picker reads the stored slug and re-
    applies it before the user interacts. Quota / private-mode errors are
    silently swallowed.
*/

import { ThemePicker } from "../ThemePicker";

export function PersistenceExample() {
    return (
        <ThemePicker
            label="Theme"
            themesUrl="/assets/themes/"
            themes={["light", "dark", "abyss"]}
            storageKey="my-app:theme"
        />
    );
}

export default PersistenceExample;
