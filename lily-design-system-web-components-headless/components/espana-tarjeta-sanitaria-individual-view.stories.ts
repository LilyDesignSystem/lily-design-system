import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./espana-tarjeta-sanitaria-individual-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/EspanaTarjetaSanitariaIndividualView",
    render: (args) => h("lily-espana-tarjeta-sanitaria-individual-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Tarjeta Sanitaria Individual",
        "value": "AA1234567"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
