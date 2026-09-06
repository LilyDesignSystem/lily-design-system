import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./progress-bar.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Navigation/ProgressBar",
    render: (args) => h("lily-progress-bar", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Upload progress",
        "value": "40"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
