import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./colombia-cedula-de-ciudadania-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/ColombiaCedulaDeCiudadaniaView",
    render: (args) =>
        h(
            "lily-colombia-cedula-de-ciudadania-view",
            args as Record<string, string | boolean>,
            SLOT,
        ),
    args: {
        label: "Cedula de Ciudadania Number",
        value: "1.020.304.050",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
