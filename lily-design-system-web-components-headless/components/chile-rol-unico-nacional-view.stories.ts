import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./chile-rol-unico-nacional-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/ChileRolUnicoNacionalView",
    render: (args) => h("lily-chile-rol-unico-nacional-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Rol Único Nacional (RUN)",
        "value": "12345678-K"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
