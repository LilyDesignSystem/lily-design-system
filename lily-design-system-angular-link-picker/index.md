# LinkPicker (Angular)

A headless control for **page links**: a single-icon button (a bundled home SVG) that opens a dropdown of links **your app
defines** — "Home", "About Us", "Contact Us", "Privacy Policy". No CSS, no routes, no English.

The single source of truth is [spec/index.md](./spec/index.md); this file is the guide.

## Quick start

```ts
import { Component } from "@angular/core";
import { LinkPicker, type LinkItem } from "@lilydesignsystem/angular-link-picker";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [LinkPicker],
  template: `<lily-link-picker label="Pages" [links]="links" />`,
})
export class AppHeader {
  links: LinkItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about/" },
  { label: "Contact Us", href: "/contact/" },
  { label: "Privacy Policy", href: "/privacy/" },
];
}
```

`label` names the button, the list and the tooltip. There is **no default list**: the package ships no routes and no English.

## Client-side navigation

```ts
import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { LinkPicker } from "@lilydesignsystem/angular-link-picker";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [LinkPicker],
  template: `<lily-link-picker label="Pages" [links]="links()" [navigate]="go" />`,
})
export class AppHeader {
  private router = inject(Router);
  go = (href: string) => void this.router.navigateByUrl(href);
  links = () => [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about/" },
  { label: "Contact Us", href: "/contact/" },
  { label: "Privacy Policy", href: "/privacy/" },
].map((p) => ({ ...p, current: this.router.url === p.href }));
}
```

Ctrl/Cmd/Shift/Alt-click, middle-click and `newTab` links always stay native browser behaviour.

## `LinkItem`

| Field | Notes |
| --- | --- |
| label | Visible text. Yours, so it localises. |
| href | A route (`"/about/"`) or a full URL. |
| id | Reported when a link is chosen; defaults to the href. |
| current | Marks the current page with `aria-current="page"`. |
| newTab | `target="_blank"` with `rel="noopener noreferrer"`. |

## Props

| `label` | `input.required<string>()` | yes | Accessible name of the button **and** the list; also the tooltip text. |
| `links` | `input.required<LinkItem[]>()` | yes | `{ id?, label, href, current?, newTab? }`. `id` defaults to `href`. |
| `navigate` | `input<(href: string) => void>()` | no | Client-side navigation hook (a router's `navigateByUrl`). |
| `navigated` | `output<{ id, href }>()` | no | Emitted after a link is chosen (the Svelte `onNavigate` callback). |
| icon template | `<ng-template lilyLinkPickerIcon let-args>` | no | Replaces the **icon**, not the links. |
| `className` | `input<string>()` | no | Appended to the root class. |

## Styling

Headless: no CSS ships. Hooks: `.link-picker`, `.link-picker-button`, `.link-picker-icon`, `.link-picker-tooltip`,
`.link-picker-list` (carries `hidden` when closed), `.link-picker-list-item`, `.link-picker-link`. The monorepo's 45 `themes/`
style them all, including the popup placement.

## Examples

[examples/](./examples/README.md): the four-link example, router integration and a custom icon.
