import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./progress.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Media and data/Progress",
    render: (args) => h("lily-progress", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Upload progress",
        "value": "40"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
