import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./ecuador-cedula-de-identidad-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/EcuadorCedulaDeIdentidadView",
    render: (args) =>
        h("lily-ecuador-cedula-de-identidad-view", args as Record<string, string | boolean>, SLOT),
    args: {
        label: "Cedula de Identidad Number",
        value: "1710034065",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
