import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./uruguay-cedula-de-identidad-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/UruguayCedulaDeIdentidadView",
    render: (args) =>
        h("lily-uruguay-cedula-de-identidad-view", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Cedula de Identidad Number",
        value: "1.234.567-2",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
