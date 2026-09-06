import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./status-tag.js";
import { h } from "../stories/render.js";

const SLOT = "Completed";

const meta: Meta = {
    title: "Content/StatusTag",
    render: (args) => h("lily-status-tag", args as Record<string, string | boolean>, SLOT),
    args: {
        "tone": "success",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
