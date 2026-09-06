import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./espana-tarjeta-sanitaria-individual-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/EspanaTarjetaSanitariaIndividualInput",
    render: (args) => h("lily-espana-tarjeta-sanitaria-individual-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Tarjeta Sanitaria Individual"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
