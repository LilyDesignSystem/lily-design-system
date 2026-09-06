import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./red-orange-yellow-green-blue-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Content/RedOrangeYellowGreenBlueView",
    render: (args) => h("lily-red-orange-yellow-green-blue-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Risk level",
        "value": "yellow"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
