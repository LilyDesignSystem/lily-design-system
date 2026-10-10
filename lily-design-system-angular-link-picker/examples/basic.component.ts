import { Component } from "@angular/core";
import { LinkPicker, type LinkItem } from "../link-picker.component";

// The app defines the links: the package ships no routes and no English.
@Component({
  selector: "example-basic",
  standalone: true,
  imports: [LinkPicker],
  template: `<lily-link-picker label="Pages" [links]="links" />`,
})
export class Basic {
  links: LinkItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about/" },
  { label: "Contact Us", href: "/contact/" },
  { label: "Privacy Policy", href: "/privacy/" },
];
}
