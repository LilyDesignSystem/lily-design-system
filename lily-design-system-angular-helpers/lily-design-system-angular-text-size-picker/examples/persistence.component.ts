/*
    Example 3 — localStorage persistence.

    Pass `storageKey` to make the picker remember the user's choice
    across reloads. On a fresh mount the picker reads the stored slug
    and re-applies it before the user interacts. Quota / private-mode
    errors are silently swallowed.

    Resolution order: value > localStorage[storageKey] > defaultValue >
    "medium" (if present) > sizes[0]. So a returning visitor's stored
    choice always wins over defaultValue.

    Note what is deliberately absent: there is no `detectFromSystem`
    input here, unlike theme-picker and locale-picker. Browsers expose
    no "preferred text size" signal — no media query equivalent to
    prefers-color-scheme, and no navigator.languages analogue. Users
    who scale text at the OS level are already served by browser zoom
    and the browser's own minimum-font-size setting, which this helper
    must not fight.
*/
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { TextSizePicker } from "../text-size-picker.component";

@Component({
  selector: "example-persistence",
  standalone: true,
  imports: [TextSizePicker],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <lily-text-size-picker
      label="Text size"
      [sizes]="['small', 'medium', 'large', 'x-large', 'xx-large']"
      defaultValue="medium"
      storageKey="lily-text-size"
    />
  `,
})
export class PersistenceExample {}
