import LinkPicker from "../LinkPicker";

const links = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about/" },
  { label: "Contact Us", href: "/contact/" },
  { label: "Privacy Policy", href: "/privacy/" },
];

// `children` replaces the icon inside the button, never the links. The accessible name still
// comes from `label`, so keep the content decorative.
export default function CustomIcon() {
  return (
    <LinkPicker label="Pages" links={links}>
      {({ open }) => <span aria-hidden="true">{open ? "▾" : "☰"}</span>}
    </LinkPicker>
  );
}
