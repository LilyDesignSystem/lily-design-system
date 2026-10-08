import SettingsPicker from "../SettingsPicker";

// `icon` replaces the cog inside the button, never the panel's content. The accessible
// name still comes from `label`, so keep the icon decorative.
export default function CustomIcon() {
  return (
    <SettingsPicker label="More" icon={({ open }) => <span aria-hidden="true">{open ? "×" : "⋯"}</span>}>
      <a href="/help/">Help</a>
    </SettingsPicker>
  );
}
