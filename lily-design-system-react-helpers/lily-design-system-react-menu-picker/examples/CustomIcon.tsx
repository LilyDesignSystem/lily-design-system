import MenuPicker from "../MenuPicker";

// `icon` replaces the hamburger inside the button, never the panel's content. The accessible
// name still comes from `label`, so keep the icon decorative.
export default function CustomIcon() {
  return (
    <MenuPicker label="More" icon={({ open }) => <span aria-hidden="true">{open ? "×" : "⋯"}</span>}>
      <a href="/help/">Help</a>
    </MenuPicker>
  );
}
