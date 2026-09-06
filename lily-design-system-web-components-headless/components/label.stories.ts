import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./label.js";
import { h } from "../stories/render.js";

const SLOT = "Name";

const meta: Meta = {
    title: "Forms/Label",
    render: (args) => h("lily-label", args as Record<string, string | boolean>, SLOT),
    args: {
        "for": "name-input"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
