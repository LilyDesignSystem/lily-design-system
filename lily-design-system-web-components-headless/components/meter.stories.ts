import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./meter.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Media and data/Meter",
    render: (args) => h("lily-meter", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Disk usage",
        "value": "72"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
