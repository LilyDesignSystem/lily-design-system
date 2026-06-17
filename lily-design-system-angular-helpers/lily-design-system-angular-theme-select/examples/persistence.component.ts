/*
    Example 3 — localStorage persistence.

    Pass `storageKey` to make the picker remember the user's choice
    across reloads. On a fresh mount the picker reads the stored slug
    and re-applies it before the user interacts. Quota / private-mode
    errors are silently swallowed.
*/
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ThemeSelect } from "../theme-select.component";

@Component({
    selector: "example-persistence",
    standalone: true,
    imports: [ThemeSelect],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <lily-theme-select
            label="Theme"
            themesUrl="/assets/themes/"
            [themes]="['light', 'dark', 'abyss']"
            storageKey="my-app:theme"
        />
    `,
})
export class PersistenceExample {}
