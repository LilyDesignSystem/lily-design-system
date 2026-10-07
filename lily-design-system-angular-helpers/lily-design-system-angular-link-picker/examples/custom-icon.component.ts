import { Component } from "@angular/core";
import { LinkPicker, LinkPickerIcon } from "../link-picker.component";

// A projected <ng-template lilyLinkPickerIcon> replaces the icon inside the button, never the links.
@Component({
  selector: "example-custom-icon",
  standalone: true,
  imports: [LinkPicker, LinkPickerIcon],
  template: `
    <lily-link-picker label="Pages" [links]="links">
      <ng-template lilyLinkPickerIcon let-args><span aria-hidden="true">{{ args.open ? "▾" : "☰" }}</span></ng-template>
    </lily-link-picker>
  `,
})
export class CustomIcon {
  links = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about/" },
  { label: "Contact Us", href: "/contact/" },
  { label: "Privacy Policy", href: "/privacy/" },
];
}
