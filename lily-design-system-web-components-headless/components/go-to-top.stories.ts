import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./go-to-top.js";
import { h } from "../stories/render.js";

const meta: Meta = {
    title: "Links/GoToTop",
    render: (args) => h("lily-go-to-top", args as Record<string, string | boolean>),
    args: {
        "label": "Back to top"
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
