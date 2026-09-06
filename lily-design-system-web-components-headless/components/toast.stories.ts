import type { Meta, StoryObj } from "@storybook/web-components-vite";

import "./toast.js";
import { h } from "../stories/render.js";

const SLOT = "Your changes have been saved.";

const meta: Meta = {
    title: "Content/Toast",
    render: (args) => h("lily-toast", args as Record<string, string | boolean>, SLOT),
    args: {
        "label": "Success",
    },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
