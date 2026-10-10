import { Component } from "@angular/core";
import { SettingsPicker, SettingsPickerIcon } from "../settings-picker.component";

// A projected <ng-template lilySettingsPickerIcon> replaces the cog inside the button, never the
// panel's content.
@Component({
  selector: "example-custom-icon",
  standalone: true,
  imports: [SettingsPicker, SettingsPickerIcon],
  template: `
    <lily-settings-picker label="More">
      <ng-template lilySettingsPickerIcon let-args><span aria-hidden="true">{{ args.open ? "×" : "⋯" }}</span></ng-template>
      <a href="/help/">Help</a>
    </lily-settings-picker>
  `,
})
export class CustomIcon {}
