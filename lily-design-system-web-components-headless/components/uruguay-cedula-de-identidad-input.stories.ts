import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./uruguay-cedula-de-identidad-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/UruguayCedulaDeIdentidadInput",
    render: (args) =>
        h("lily-uruguay-cedula-de-identidad-input", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Cedula de Identidad Number",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
