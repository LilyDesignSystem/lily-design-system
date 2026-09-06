import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./tag.js";
import { h } from "../stories/render.js";

const SLOT = "Completed";

const meta: Meta = {
    title: "Content/Tag",
    render: (args) => h("lily-tag", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Status: Completed",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
