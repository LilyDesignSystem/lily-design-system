import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./timer.js";
import { h } from "../stories/render.js";

const SLOT = "05:30";

const meta: Meta = {
    title: "Content/Timer",
    render: (args) => h("lily-timer", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Session timeout countdown",
        "datetime": "PT5M30S",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
