import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./ecuador-cedula-de-identidad-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/EcuadorCedulaDeIdentidadInput",
    render: (args) =>
        h("lily-ecuador-cedula-de-identidad-input", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Cedula de Identidad Number",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
