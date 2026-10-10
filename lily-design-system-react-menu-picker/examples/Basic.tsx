import MenuPicker from "../MenuPicker";

// The app provides the panel's content: the package ships no links and no English.
export default function Basic() {
  return (
    <MenuPicker label="Menu">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about/">About Us</a></li>
        <li><button type="button">Sign out</button></li>
      </ul>
    </MenuPicker>
  );
}
