import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./republica-dominicana-cedula-de-identidad-y-electoral-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/RepublicaDominicanaCedulaDeIdentidadYElectoralView",
    render: (args) =>
        h(
            "lily-republica-dominicana-cedula-de-identidad-y-electoral-view",
            args as Record<string, string | boolean>,
            SLOT,
        ),
    args: {
        label: "Cédula de Identidad y Electoral",
        value: "001-1391820-5",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
