import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./republica-dominicana-cedula-de-identidad-y-electoral-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/RepublicaDominicanaCedulaDeIdentidadYElectoralInput",
    render: (args) =>
        h(
            "lily-republica-dominicana-cedula-de-identidad-y-electoral-input",
            args as Record<string, string | boolean>,
            SLOT,
        ),
    args: {
        label: "Cédula de Identidad y Electoral",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
