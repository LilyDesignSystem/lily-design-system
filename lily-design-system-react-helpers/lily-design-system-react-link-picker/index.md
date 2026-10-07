# LinkPicker (React)

A headless control for **page links**: a single-icon button (a bundled home SVG) that opens a dropdown of links **your app
defines** — "Home", "About Us", "Contact Us", "Privacy Policy". No CSS, no routes, no English.

The single source of truth is [spec/index.md](./spec/index.md); this file is the guide.

## Quick start

```tsx
import LinkPicker, { type LinkItem } from "@lilydesignsystem/react-link-picker";

const links: LinkItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about/" },
  { label: "Contact Us", href: "/contact/" },
  { label: "Privacy Policy", href: "/privacy/" },
];

export function Header() {
  return <LinkPicker label="Pages" links={links} />;
}
```

`label` names the button, the list and the tooltip. There is **no default list**: the package ships no routes and no English.

## Client-side navigation

```tsx
import { useLocation, useNavigate } from "react-router";
import LinkPicker from "@lilydesignsystem/react-link-picker";

const pages = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about/" },
  { label: "Contact Us", href: "/contact/" },
  { label: "Privacy Policy", href: "/privacy/" },
];

export function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const links = pages.map((p) => ({ ...p, current: pathname === p.href }));
  return <LinkPicker label="Pages" links={links} navigate={(href) => navigate(href)} />;
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

| `label` | `string` | yes | Accessible name of the button **and** the list; also the tooltip text. |
| `links` | `LinkItem[]` | yes | `{ id?, label, href, current?, newTab? }`. `id` defaults to `href`. |
| `navigate` | `(href: string) => void` | no | Client-side navigation hook (a router's `navigate`). |
| `onNavigate` | `(id: string, href: string) => void` | no | Fires after a link is chosen. |
| `children` | `(args: { open }) => ReactNode` | no | Render prop replacing the **icon**, not the links. |
| `className` | `string` | no | Appended to the root class. |
| `...rest` | | | Spread on the root `<div>`. |

## Styling

Headless: no CSS ships. Hooks: `.link-picker`, `.link-picker-button`, `.link-picker-icon`, `.link-picker-tooltip`,
`.link-picker-list` (carries `hidden` when closed), `.link-picker-list-item`, `.link-picker-link`. The monorepo's 45 `themes/`
style them all, including the popup placement.

## Examples

[examples/](./examples/README.md): the four-link example, router integration and a custom icon.
