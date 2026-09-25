import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./chile-rol-unico-nacional-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/ChileRolUnicoNacionalInput",
    render: (args) => h("lily-chile-rol-unico-nacional-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Rol Único Nacional (RUN)"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
