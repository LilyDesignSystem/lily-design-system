import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./mark.js";
import { h } from "../stories/render.js";

const SLOT = "Text";

const meta: Meta = {
    title: "Media and data/Mark",
    render: (args) => h("lily-mark", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Mark"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
