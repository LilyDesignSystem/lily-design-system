import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./island-kennitala-view.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Special-Purpose Identifiers/IslandKennitalaView",
    render: (args) => h("lily-island-kennitala-view", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Kennitala",
        "value": "1207904929"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
