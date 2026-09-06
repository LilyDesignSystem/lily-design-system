import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./week-input.js";
import { h } from "../stories/render.js";

const SLOT = "";

const meta: Meta = {
    title: "Forms/WeekInput",
    render: (args) => h("lily-week-input", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Sprint start week",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
