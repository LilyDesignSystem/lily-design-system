<script lang="ts">
    import { ColorPicker } from "../index";

    let colour = $state("#005eb8");
    let recent = $state<string[]>([]);
</script>

<ColorPicker
    labels={{
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
    }}
    bind:value={colour}
    bind:recent
    name="colour"
/>

<p>Chosen: {colour}</p>
