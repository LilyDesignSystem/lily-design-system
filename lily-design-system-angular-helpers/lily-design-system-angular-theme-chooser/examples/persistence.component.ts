/*
    Example 3 — localStorage persistence.

    Pass `storageKey` to make the select remember the user's choice
    across reloads. On a fresh mount the select reads the stored slug
    and re-applies it before the user interacts. Quota / private-mode
    errors are silently swallowed.
*/
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ThemeChooser } from "../theme-chooser.component";

@Component({
    selector: "example-persistence",
    standalone: true,
    imports: [ThemeChooser],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <lily-theme-chooser
            label="Theme"
            themesUrl="/assets/themes/"
            [themes]="['light', 'dark', 'abyss']"
            storageKey="my-app:theme"
        />
    `,
})
export class PersistenceExample {}
