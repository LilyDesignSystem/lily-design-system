import { Component } from "@angular/core";
import { SettingsPicker } from "../settings-picker.component";

// A form in the panel. `#menu="lilySettingsPicker"` gives the content a way to close the panel;
// typing in the input does not close it (it is not a link or button).
@Component({
  selector: "example-form",
  standalone: true,
  imports: [SettingsPicker],
  template: `
    <lily-settings-picker #menu="lilySettingsPicker" label="Settings">
      <form (submit)="$event.preventDefault(); menu.close()">
        <input type="search" aria-label="Search" />
        <button type="submit" data-settings-picker-keep-open>Go</button>
      </form>
    </lily-settings-picker>
  `,
})
export class Form {}
