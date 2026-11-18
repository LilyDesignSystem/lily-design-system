import { createSignal } from "solid-js";
import { ColorPicker } from "../ColorPicker";

const labels = {
    picker: "Text colour",
    recent: "Recent colours",
    palette: "Colours",
    transparent: "Transparent",
    custom: "Custom colour",
    hex: "Hex",
    name: "Colour name",
    hue: "Hue",
    saturation: "Saturation",
    lightness: "Lightness",
    brightness: "Brightness",
    hsl: "HSL",
    hsb: "HSB",
    rgb: "RGB",
    cmyk: "CMYK",
    red: "Red",
    green: "Green",
    blue: "Blue",
    cyan: "Cyan",
    magenta: "Magenta",
    yellow: "Yellow",
    key: "Black",
    invalid: "Not a colour",
};

export default function Basic() {
    const [colour, setColour] = createSignal("#005eb8");
    const [recent, setRecent] = createSignal<string[]>([]);
    return (
        <form>
            <ColorPicker
                labels={labels}
                value={colour()}
                onChange={setColour}
                recent={recent()}
                onRecentChange={setRecent}
                name="colour"
            />
            <p>Chosen: {colour()}</p>
        </form>
    );
}
