import { useLocation, useNavigate } from "react-router";
import LinkPicker from "../LinkPicker";

const pages = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about/" },
  { label: "Contact Us", href: "/contact/" },
  { label: "Privacy Policy", href: "/privacy/" },
];

// `navigate` turns a plain left click into router navigation; Ctrl/Cmd-click, middle click and
// newTab links stay native. `current` marks the page you are on with aria-current="page".
export default function Router() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const links = pages.map((p) => ({ ...p, current: pathname === p.href }));
  return <LinkPicker label="Pages" links={links} navigate={(href) => navigate(href)} />;
}
