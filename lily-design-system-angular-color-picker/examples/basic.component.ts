import { Component, signal } from "@angular/core";
import { ColorPicker, type Labels } from "../color-picker.component";

@Component({
    selector: "app-basic-color-picker",
    standalone: true,
    imports: [ColorPicker],
    template: `
    <form>
      <lily-color-picker [labels]="labels" [(value)]="colour" [(recent)]="recent" name="colour" />
      <p>Chosen: {{ colour() }}</p>
    </form>
  `,
})
export class BasicColorPicker {
    readonly labels: Labels = {
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
    readonly colour = signal("#005eb8");
    readonly recent = signal<string[]>([]);
}
