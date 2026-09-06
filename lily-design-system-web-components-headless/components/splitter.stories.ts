import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./splitter.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Content/Splitter",
    render: (args) => h("lily-splitter", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Resize file tree and editor",
        "orientation": "vertical",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
