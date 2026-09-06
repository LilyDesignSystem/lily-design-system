import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./portugal-passaporte-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "National identifiers/PortugalPassaporteView",
    render: (args) => h("lily-portugal-passaporte-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Passaporte",
        "value": "N123456"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
