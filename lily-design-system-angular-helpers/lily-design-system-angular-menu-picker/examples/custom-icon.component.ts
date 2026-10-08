import { Component } from "@angular/core";
import { MenuPicker, MenuPickerIcon } from "../menu-picker.component";

// A projected <ng-template lilyMenuPickerIcon> replaces the hamburger inside the button, never the
// panel's content.
@Component({
  selector: "example-custom-icon",
  standalone: true,
  imports: [MenuPicker, MenuPickerIcon],
  template: `
    <lily-menu-picker label="More">
      <ng-template lilyMenuPickerIcon let-args><span aria-hidden="true">{{ args.open ? "×" : "⋯" }}</span></ng-template>
      <a href="/help/">Help</a>
    </lily-menu-picker>
  `,
})
export class CustomIcon {}
