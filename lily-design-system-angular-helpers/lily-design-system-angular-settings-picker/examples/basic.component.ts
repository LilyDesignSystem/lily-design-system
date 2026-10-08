import { Component } from "@angular/core";
import { SettingsPicker } from "../settings-picker.component";

// The app provides the panel's content: the package ships no links and no English.
@Component({
  selector: "example-basic",
  standalone: true,
  imports: [SettingsPicker],
  template: `
    <lily-settings-picker label="Settings">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about/">About Us</a></li>
        <li><button type="button">Sign out</button></li>
      </ul>
    </lily-settings-picker>
  `,
})
export class Basic {}
