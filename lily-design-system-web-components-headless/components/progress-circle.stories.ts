import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./progress-circle.js";
import { h } from "../stories/render.js";

const SLOT = "<span>75%</span>";

const meta: Meta = {
    title: "Content/ProgressCircle",
    render: (args) => h("lily-progress-circle", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Upload progress",
        "value": "75"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
