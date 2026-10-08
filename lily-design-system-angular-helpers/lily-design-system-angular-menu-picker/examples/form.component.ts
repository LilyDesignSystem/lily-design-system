import { Component } from "@angular/core";
import { MenuPicker } from "../menu-picker.component";

// A form in the panel. `#menu="lilyMenuPicker"` gives the content a way to close the panel;
// typing in the input does not close it (it is not a link or button).
@Component({
  selector: "example-form",
  standalone: true,
  imports: [MenuPicker],
  template: `
    <lily-menu-picker #menu="lilyMenuPicker" label="Menu">
      <form (submit)="$event.preventDefault(); menu.close()">
        <input type="search" aria-label="Search" />
        <button type="submit" data-menu-picker-keep-open>Go</button>
      </form>
    </lily-menu-picker>
  `,
})
export class Form {}
