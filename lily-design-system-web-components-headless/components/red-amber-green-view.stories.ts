import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./red-amber-green-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Content/RedAmberGreenView",
    render: (args) => h("lily-red-amber-green-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Project status",
        "value": "green"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
