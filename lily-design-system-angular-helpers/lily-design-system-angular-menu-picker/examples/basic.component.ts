import { Component } from "@angular/core";
import { MenuPicker } from "../menu-picker.component";

// The app provides the panel's content: the package ships no links and no English.
@Component({
  selector: "example-basic",
  standalone: true,
  imports: [MenuPicker],
  template: `
    <lily-menu-picker label="Menu">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about/">About Us</a></li>
        <li><button type="button">Sign out</button></li>
      </ul>
    </lily-menu-picker>
  `,
})
export class Basic {}
