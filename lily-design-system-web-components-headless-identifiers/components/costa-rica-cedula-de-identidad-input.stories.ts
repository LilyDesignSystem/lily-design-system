import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./costa-rica-cedula-de-identidad-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/CostaRicaCedulaDeIdentidadInput",
    render: (args) =>
        h(
            "lily-costa-rica-cedula-de-identidad-input",
            args as Record<string, string | boolean>,
            SLOT,
        ),
    args: {
        label: "Cédula de Identidad",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
