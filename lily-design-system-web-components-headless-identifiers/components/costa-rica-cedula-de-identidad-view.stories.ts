import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./costa-rica-cedula-de-identidad-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/CostaRicaCedulaDeIdentidadView",
    render: (args) =>
        h(
            "lily-costa-rica-cedula-de-identidad-view",
            args as Record<string, string | boolean>,
            SLOT,
        ),
    args: {
        label: "Cédula de Identidad",
        value: "1-0613-0584",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
