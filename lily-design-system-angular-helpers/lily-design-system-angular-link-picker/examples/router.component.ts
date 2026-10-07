import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { LinkPicker } from "../link-picker.component";

// `navigate` turns a plain left click into router navigation; Ctrl/Cmd-click, middle click and
// newTab links stay native. `current` marks the page you are on with aria-current="page".
@Component({
  selector: "example-router",
  standalone: true,
  imports: [LinkPicker],
  template: `<lily-link-picker label="Pages" [links]="links()" [navigate]="go" />`,
})
export class RouterExample {
  private router = inject(Router);
  go = (href: string) => void this.router.navigateByUrl(href);
  links = () => [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about/" },
  { label: "Contact Us", href: "/contact/" },
  { label: "Privacy Policy", href: "/privacy/" },
].map((p) => ({ ...p, current: this.router.url === p.href }));
}
