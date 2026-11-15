<script setup lang="ts">
import { ref } from "vue";
import ColorPicker from "../ColorPicker.vue";

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
const colour = ref("#005eb8");
const recent = ref<string[]>([]);
</script>

<template>
    <form>
        <ColorPicker
            v-model="colour"
            v-model:recent="recent"
            :labels="labels"
            name="colour"
        />
        <p>Chosen: {{ colour }}</p>
    </form>
</template>
